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

	// storage := Storage{}
	// storage.Connect()
	// return

	pgPassword, exists := os.LookupEnv("POSTGRES_PASSWORD")



	if !exists {
		log.Fatal("POSTGRES_PASSWORD env not set")
	}

	database := Database{}
	err := database.Connect(pgPassword)


	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected to db")

	// inputFromCsv(&database)

	var setup bool
	flag.BoolVar(&setup, "setup", false, "Setup db tables")
	flag.Parse()
	// if setup {
	// }
	database.Setup()

	api := Api{
		listenAddr: ":3001",
		storage: &database,
	}
	api.Run()
}

func inputFromCsv(sorage *Database) {
	csv := readCsvFile("data.csv")

	for i := len(csv)-1; i >= 0; i-- {
		rows := csv[i]
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