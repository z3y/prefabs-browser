package main

import (
	"encoding/csv"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
)

func main() {

	pgPassword, exists := os.LookupEnv("POSTGRES_PASSWORD")



	if !exists {
		log.Fatal("POSTGRES_PASSWORD env not set")
	}

	storage := Storage{}
	err := storage.Connect(pgPassword)


	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to db")

	// inputFromCsv(&storage)
	// return;


	var setup bool
	flag.BoolVar(&setup, "setup", false, "Setup db tables")
	flag.Parse()
	// if setup {
	// }
	storage.Setup()

	api := Api{
		listenAddr: ":3000",
		storage: &storage,
	}
	api.Run()
}

func inputFromCsv(sorage *Storage) {
	csv := readCsvFile("data.csv")

	for _, rows := range csv {
		name := strings.TrimSpace(rows[1])
		creator :=  strings.TrimSpace(rows[2])
		description :=  strings.TrimSpace(rows[4])
		link :=  strings.TrimSpace(rows[5])

		fmt.Printf("%s|%s|%s|%s\n", name, creator, description, link)

		prefab := Prefab{
			Name:        name,
			Category:    "udon",
			Creator:     creator,
			Link:        link,
			Description: description,
		}
		sorage.NewPrefab(&prefab)
	}
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