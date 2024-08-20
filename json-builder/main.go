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

	buildFromCsv(sheets[0])
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

const dir = "input"

var sheets = []Sheet{
	// {name: "Creator Companion", gid: "1991500993"},
	{
		name:          "Udon",
		gid:           "1520869360",
		nameId:        0,
		creatorId:     1,
		linkId:        4,
		descriptionId: 3,
		previewId:     -1,
		timestampId:   5,
	},
	{
		name:          "AV3",
		gid:           "113748590",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     7,
		timestampId:   4,
	},
	{
		name:          "Shaders",
		gid:           "1207467774",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     6,
		timestampId:   4,
	},
	{
		name:          "Tutorials",
		gid:           "81530312",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     -1,
		timestampId:   4,
	},
	{
		name:          "Tools",
		gid:           "1950242888",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     7,
		timestampId:   4,
	},
	{
		name:          "General Assets",
		gid:           "1258606581",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     7,
		timestampId:   4,
	},
}

func fetchCsv() error {

	url := "https://docs.google.com/spreadsheets/d/e/2PACX-1vTP-eIkYLZh7pDhpO-untxy1zbuoiqdzVP2z5-vg_9ijBW7k8ZC9VP6cVL-ct5yKrySPBPJ6V2ymlWS/pub?output=csv&gid="

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

func buildFromCsv(sheet Sheet) {
	csv := readCsvFile(filepath.Join(dir, sheet.name+".csv"))

	prefabs := []Prefab{}

	for i := 0; i < len(csv); i++ {
		rows := csv[i]
		name := strings.TrimSpace(rows[sheet.nameId])
		creator := strings.TrimSpace(rows[sheet.creatorId])
		description := strings.TrimSpace(rows[sheet.descriptionId])
		link := strings.TrimSpace(rows[sheet.linkId])
		time := strings.TrimSpace(rows[sheet.timestampId])

		if link == "" {
			continue
		}

		if !strings.HasPrefix(link, "https://") {
			log.Printf("invalid url: %s, at name: %s, sheet: %s\n", link, name, sheet.name)
			continue
		}

		//fmt.Printf("%s|%s|%s|%s\n", name, creator, description, link)

		timestamp, err := tryParseCursedTimestamp(time)
		if err != nil {
			log.Println(err)
			continue
		}

		prefab := Prefab{
			Name:        name,
			Category:    "",
			Creator:     creator,
			Link:        link,
			Description: description,
			Timestamp:   timestamp,
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

func tryParseCursedTimestamp(text string) (time.Time, error) {

	text = strings.ReplaceAll(text, "/", "-")

	t, err := time.Parse("1-2-2006 15:04:05", text)
	if err == nil {
		return t, nil
	}

	return time.Time{}, err
}
