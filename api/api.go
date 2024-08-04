package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/rs/cors"
)

type Api struct {
	listenAddr string
	storage    *Storage
}

func (a *Api) Run() {

	mux := http.NewServeMux()

	mux.HandleFunc("GET /search", a.handleSearch)
	mux.HandleFunc("POST /prefab", a.handleNewPrefab)
	mux.HandleFunc("DELETE /prefab", a.handleDelete)

    handler := cors.Default().Handler(mux)

	log.Fatal(http.ListenAndServe(a.listenAddr, handler))
}

func writeJson(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

type Prefab struct {
	Id          string    `json:"id,omitempty"`
	Name        string    `json:"name,omitempty"`
	Category    string    `json:"category,omitempty"`
	Creator     string    `json:"creator,omitempty"`
	Link        string    `json:"link,omitempty"`
	Description string    `json:"description,omitempty"`
	Thumbnail   string    `json:"thumbnail,omitempty"`
	Added       time.Time `json:"added,omitempty"`
}

func (a *Api) handleNewPrefab(w http.ResponseWriter, r *http.Request) {

	result := Prefab{}

	if err := json.NewDecoder(r.Body).Decode(&result); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if result.Name == "" || result.Category == "" || result.Creator == "" || result.Link == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	a.storage.NewPrefab(&result)
}

func (a *Api) handleSearch(w http.ResponseWriter, r *http.Request) {

	name := r.URL.Query().Get("name")
	category := r.URL.Query().Get("category")
	sortingQ := r.URL.Query().Get("sort")

	sorting := "desc";
	if sortingQ == "old" {
		sorting = "asc"
	}

	
	query := `select id, name, category, creator, link, description, thumbnail, added from prefabs`

	conditions := []string{}
	args := []any{}



	if name != "" && name != "null" {
		args = append(args, strings.Join(strings.Fields(name), " & "))
		l := len(args)
		args = append(args, "%" + name + "%")
		conditions = append(conditions, fmt.Sprintf("lower(name) like lower($%d) or to_tsvector(name) @@ to_tsquery($%d) or lower(creator) like lower($%d) or to_tsvector(description) @@ to_tsquery($%d)", l + 1, l, l + 1, l))
	}
	if category != "" && category != "null" {
		args = append(args, category)
		conditions = append(conditions,  fmt.Sprintf("category = $%d", len(args)))
	}

	if len(conditions) > 0 {
		query += " WHERE " + strings.Join(conditions, " and ")
	}

	query += fmt.Sprintf(" order by added %s", sorting)

	// query += " limit 10"

	rows, err := a.storage.db.Query(
		query,
		args...)


	if err != nil {
		log.Println(err)
		writeJson(w, http.StatusBadRequest, "")
		return 
	}
	defer rows.Close()
		
	result := []Prefab{}

	for rows.Next() {
		p := Prefab{}

		err = rows.Scan(&p.Id, &p.Name, &p.Category, &p.Creator, &p.Link, &p.Description, &p.Thumbnail, &p.Added)
		if err != nil {
			log.Println(err)
		} else {
			result = append(result, p)
		}
	}

	log.Printf("Searching for name: %s, category: %s; found: %d results", name, category, len(result))

	writeJson(w, http.StatusOK, result)

}

func (a *Api) handleDelete(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")
	
	query := "delete from prefabs where id = $1"
	_, err := a.storage.db.Exec(query, id)

	if err != nil {
		log.Println(err)
		writeJson(w, http.StatusBadRequest, "")
		return 
	}

	log.Printf("Deleted prefab %s", id)
	writeJson(w, http.StatusOK, "")
}