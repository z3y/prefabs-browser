package main

import (
	"crypto/sha1"
	"encoding/csv"
	"encoding/hex"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

var scape = false

func main() {

	shouldFetch := flag.Bool("fetch", false, "fetch and save csv files from google docs")
	flag.BoolVar(&scape, "scrape", false, "try and scrape thumbnails for whats possible")
	flag.Parse()

	loadCache()

	if *shouldFetch {
		fetchCsv()
	}

	for i := range sheets {
		buildFromCsv(sheets[i])
	}
}

func loadCache() {
	for i := range sheets {

		f, err := os.Open(filepath.Join(outputDir, sheets[i].name+".json"))
		if err != nil {
			continue
		}
		defer f.Close()

		prefabs := []Prefab{}

		data, err := io.ReadAll(f)

		if err != nil {
			continue
		}
		err = json.Unmarshal(data, &prefabs)
		if err != nil {
			continue
		}

		if len(prefabs) > 0 {
			sheets[i].cache = prefabs
		}
	}
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
	cache         []Prefab
}

const inputDir = "input"

var sheets = []Sheet{
	// {name: "Creator Companion", gid: "1991500993"},
	{
		name:          "udon",
		gid:           "1520869360",
		nameId:        0,
		creatorId:     1,
		linkId:        4,
		descriptionId: 3,
		previewId:     -1,
		timestampId:   5,
	},
	{
		name:          "avatar",
		gid:           "113748590",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     7,
		timestampId:   4,
	},
	{
		name:          "shaders",
		gid:           "1207467774",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     6,
		timestampId:   4,
	},
	{
		name:          "tutorials",
		gid:           "81530312",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     -1,
		timestampId:   4,
	},
	{
		name:          "tools",
		gid:           "1950242888",
		nameId:        0,
		creatorId:     1,
		linkId:        3,
		descriptionId: 2,
		previewId:     7,
		timestampId:   4,
	},
	{
		name:          "general",
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

	os.Mkdir(inputDir, os.ModePerm)

	for i := range sheets {
		sheet := sheets[i]

		out, err := os.Create(filepath.Join(inputDir, sheet.name+".csv"))
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
	Creator     string    `json:"creator,omitempty"`
	Link        string    `json:"link,omitempty"`
	Description string    `json:"description,omitempty"`
	Thumbnail   string    `json:"thumbnail,omitempty"`
	Timestamp   time.Time `json:"timestamp,omitempty"`
}

const outputDir = "output"

func buildFromCsv(sheet Sheet) {
	csv := readCsvFile(filepath.Join(inputDir, sheet.name+".csv"))

	prefabs := []Prefab{}

	totalPreviews := 0
	validPreviews := 0

	for i := 0; i < len(csv); i++ {
		rows := csv[i]
		name := strings.TrimSpace(rows[sheet.nameId])
		creator := strings.TrimSpace(rows[sheet.creatorId])
		description := strings.TrimSpace(rows[sheet.descriptionId])
		link := strings.TrimSpace(rows[sheet.linkId])
		time := strings.TrimSpace(rows[sheet.timestampId])

		if link == "" || strings.HasPrefix("Download Link", link) {
			continue
		}

		if isDiscord(link) {
			continue
		}

		// most of the http links actually have ssl
		if !strings.HasPrefix(link, "https://") && !strings.HasPrefix(link, "http://") {
			// log.Printf("invalid url: %s, at name: %s, sheet: %s\n", link, name, sheet.name)
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
			Creator:     creator,
			Link:        link,
			Description: description,
			Timestamp:   timestamp,
		}

		if sheet.previewId > 0 {

			preview := strings.TrimSpace(rows[sheet.previewId])

			if preview != "" {
				totalPreviews += 1
				previewUrl := tryParsePreviewUrl(preview)

				if previewUrl != "" && !isDiscord(previewUrl) {
					prefab.Thumbnail = previewUrl
					validPreviews += 1
				}
			}
		}

		h := sha1.New()
		h.Write([]byte(prefab.Name))
		prefab.Id = hex.EncodeToString(h.Sum(nil))
		// log.Println(prefab.Id)

		if scape && prefab.Thumbnail == "" {

			if sheet.cache != nil && len(sheet.cache) > 0 {
				for _, c := range sheet.cache {
					if c.Id == prefab.Id {
						prefab.Thumbnail = c.Thumbnail
						break
					}
				}
			} else if prefab.Thumbnail == "" {
				previewUrl := scrapeThumbnail(prefab.Link)
				if previewUrl != "" {
					prefab.Thumbnail = previewUrl
					validPreviews += 1
				}
			}
		}

		prefabs = append(prefabs, prefab)
	}

	sort.Slice(prefabs, func(i, j int) bool {
		return prefabs[i].Timestamp.Unix() > prefabs[j].Timestamp.Unix()
	})

	jsonData, err := json.MarshalIndent(prefabs, "", "	")

	if err != nil {
		log.Fatal(err)
	}
	os.Mkdir(outputDir, os.ModePerm)

	log.Printf("Valid Previews: %d/%d, for sheet: %s", validPreviews, totalPreviews, sheet.name)

	os.WriteFile(filepath.Join(outputDir, sheet.name+".json"), jsonData, os.ModePerm)
}

func tryParsePreviewUrl(preview string) string {
	if strings.HasSuffix(preview, ".png") ||
		strings.HasSuffix(preview, ".jpg") ||
		strings.HasSuffix(preview, ".webp") ||
		strings.HasSuffix(preview, ".jpeg") ||
		strings.HasSuffix(preview, ".gif") ||
		strings.HasSuffix(preview, ".gifv") {
		return preview
	}

	imgurId, isImgur := strings.CutPrefix(preview, "https://imgur.com/")
	if isImgur && strings.HasPrefix(imgurId, "a/") {
		return "https://i.imgur.com/" + imgurId + ".png"
	}

	return ""
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

	t, err = time.Parse(time.DateOnly, text)
	if err == nil {
		return t, nil
	}

	t, err = time.Parse("2-1-2006", text)
	if err == nil {
		return t, nil
	}

	return time.Time{}, err
}

var httpClient = http.Client{
	Timeout: time.Duration(5 * time.Second),
}

// func pingUrl(url string) bool {
// 	_, err := httpClient.Get(url)
// 	return err != nil
// }

// discord urls are dead
func isDiscord(url string) bool {
	return strings.HasPrefix(url, "https://cdn.discordapp.com/") || strings.HasPrefix(url, "https://media.discordapp.net/")
}

func scrapeThumbnail(url string) string {

	if strings.Contains(url, "booth.pm/") {
		return scrapeBooth(url)
	} else if strings.Contains(url, "gumroad.com/l/") {
		return scrapeGumroad(url)
	}

	return ""
}

func scrapeBooth(url string) string {
	resp, err := httpClient.Get(url)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return ""
	}

	imageSrc, exists := doc.Find(".market-item-detail-item-image-wrapper img").Attr("src")
	if !exists {
		return ""
	}

	fmt.Println("Direct image link:", imageSrc)
	return imageSrc
}

func scrapeGumroad(url string) string {

	resp, err := httpClient.Get(url)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return ""
	}

	imageSrc, exists := doc.Find(`meta[property="twitter:image"]`).Attr("value")
	if !exists {
		log.Printf("Could not find the image src\n")
		return ""
	}

	if strings.HasPrefix(imageSrc, "https://public-files.gumroad.com/") {
		fmt.Println("Direct image link:", imageSrc)
		return imageSrc
	}

	return ""
}
