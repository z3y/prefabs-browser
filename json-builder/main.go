package main

import (
	"encoding/csv"
	"encoding/json"
	"flag"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func main() {

	shouldFetch := flag.Bool("fetch", false, "fetch and save csv files from google docs")
	flag.Parse()

	if *shouldFetch {
		fetchCsv()
	}

	buildFromCsv()
}

type Sheet struct {
	name          string
	gid           string
	nameId        int
	creatorId     int
	linkId        int
	descriptionId int
	previewId     int
	timestampId   int
}

var sheets = []Sheet{
	// {name: "Creator Companion", gid: "1991500993"},
	{
		name:          "Udon",
		gid:           "1520869360",
		nameId:        1,
		creatorId:     2,
		linkId:        5,
		descriptionId: 4,
		previewId:     -1,
		timestampId:   6,
	},
	{
		name:          "AV3",
		gid:           "113748590",
		nameId:        1,
		creatorId:     2,
		linkId:        4,
		descriptionId: 3,
		previewId:     8,
		timestampId:   5,
	},
	{
		name:          "Shaders",
		gid:           "1207467774",
		nameId:        1,
		creatorId:     2,
		linkId:        4,
		descriptionId: 3,
		previewId:     7,
		timestampId:   5,
	},
	{
		name:          "Tutorials",
		gid:           "81530312",
		nameId:        1,
		creatorId:     2,
		linkId:        4,
		descriptionId: 3,
		previewId:     -1,
		timestampId:   5,
	},
	{
		name:          "Tools",
		gid:           "1950242888",
		nameId:        1,
		creatorId:     2,
		linkId:        4,
		descriptionId: 3,
		previewId:     8,
		timestampId:   5,
	},
	{
		name:          "General Assets",
		gid:           "1258606581",
		nameId:        1,
		creatorId:     2,
		linkId:        4,
		descriptionId: 3,
		previewId:     8,
		timestampId:   5,
	},
}

func fetchCsv() error {

	url := "https://docs.google.com/spreadsheets/d/e/2PACX-1vTP-eIkYLZh7pDhpO-untxy1zbuoiqdzVP2z5-vg_9ijBW7k8ZC9VP6cVL-ct5yKrySPBPJ6V2ymlWS/pub?output=csv&gid="

	const dir = "input"
	os.Mkdir(dir, os.ModePerm)

	for i := range sheets {
		sheet := sheets[i]

		out, err := os.Create(filepath.Join(dir, sheet.name+".csv"))
		if err != nil {
			return err
		}
		defer out.Close()

		resp, err := http.Get(url + sheet.gid)
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		_, err = io.Copy(out, resp.Body)
		if err != nil {
			return err
		}
	}

	return nil
}

type Prefab struct {
	Id          string    `json:"id,omitempty"`
	Name        string    `json:"name,omitempty"`
	Category    string    `json:"category,omitempty"`
	Creator     string    `json:"creator,omitempty"`
	Link        string    `json:"link,omitempty"`
	Description string    `json:"description,omitempty"`
	Thumbnail   string    `json:"thumbnail,omitempty"`
	Timestamp   time.Time `json:"timestamp,omitempty"`
}

func buildFromCsv() {
	csv := readCsvFile("input.csv")

	prefabs := []Prefab{}

	for i := len(csv) - 1; i >= 0; i-- {
		rows := csv[i]
		name := strings.TrimSpace(rows[1])
		creator := strings.TrimSpace(rows[2])
		description := strings.TrimSpace(rows[4])
		link := strings.TrimSpace(rows[5])

		if link == "" {
			continue
		}

		//fmt.Printf("%s|%s|%s|%s\n", name, creator, description, link)

		prefab := Prefab{
			Name:        name,
			Category:    "",
			Creator:     creator,
			Link:        link,
			Description: description,
		}

		prefabs = append(prefabs, prefab)
	}

	jsonData, err := json.MarshalIndent(prefabs, "", "	")

	if err != nil {
		log.Fatal(err)
	}

	os.WriteFile("output.json", jsonData, os.ModePerm)
}

func readCsvFile(filePath string) [][]string {
	f, err := os.Open(filePath)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	csvReader := csv.NewReader(f)
	csvReader.LazyQuotes = true
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	return records
}
