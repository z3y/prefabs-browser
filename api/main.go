package main

import (
	"flag"
	"log"
	"os"
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