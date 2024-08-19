package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

type Database struct {
	db *sql.DB
}

func (s *Database) Setup() error {
	query := `
	create table if not exists prefabs(
		id varchar(255) primary key,
		name varchar(255),
		category varchar(255),
		creator varchar(255),
		link varchar(255),
		description varchar(1000),
		thumbnail varchar(255),
		added timestamp
	)`

	_, err := s.db.Exec(query)
	return err
}

func (s *Database) Connect(password string) error {
	connectionString := fmt.Sprintf("host=localhost port=5432 user=postgres dbname=postgres password=%s sslmode=disable", password)
	// connectionString := fmt.Sprintf("host=db_postgres port=5432 user=postgres dbname=postgres password=%s sslmode=disable", password)

	// log.Printf("Connection string%s\n", connectionString)

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return err
	}

	if err := db.Ping(); err != nil {
		return err
	}

	s.db = db
	return nil
}

func (s *Database) PrefabExists(name string) (bool, error) {
	rows, err := s.db.Query("select count(1) from prefabs where name = $1", name)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	count := 0
	if rows.Next() {
		rows.Scan(&count)
	}

	return count > 0, nil
}

func (s *Database) NewPrefab(prefab *Prefab) error {


	exists, err := s.PrefabExists(prefab.Name)
	if err != nil {
		return err
	}

	if exists {
		return fmt.Errorf("prefab exists")
	}

	query := `insert into prefabs
		(id, name, category, creator, link, description, thumbnail, added)
		values ($1, $2, $3, $4, $5, $6, $7, $8)`

	prefab.Id = uuid.New().String()
	prefab.Added = time.Now().UTC()

	_, err = s.db.Exec(
		query,
		prefab.Id,
		prefab.Name,
		prefab.Category,
		prefab.Creator,
		prefab.Link,
		prefab.Description,
		prefab.Thumbnail,
		prefab.Added,
	)

	log.Printf("Created new prefab: %v\n", prefab)

	return err
}