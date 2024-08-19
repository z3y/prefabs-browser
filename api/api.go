package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/rs/cors"
)

type Api struct {
	listenAddr string
	storage    *Database
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

type SearchResult struct {
	Results []Prefab `json:"results"`
	Pages int `json:"pages"`
}

func (a *Api) handleNewPrefab(w http.ResponseWriter, r *http.Request) {
	
	r.ParseMultipartForm(10 << 20) //10 MB

	result := Prefab{}

	
	result.Name = r.FormValue("name");
	result.Link = r.FormValue("link");
	result.Category = r.FormValue("category");
	result.Creator = r.FormValue("creator");

	if result.Name == "" || result.Category == "" || result.Creator == "" || result.Link == "" {
		http.Error(w, "missing fields", http.StatusInternalServerError)
		return
	}

	
	image, _, err := r.FormFile("image")
	if err != nil {
        http.Error(w, "error retrieving the file", http.StatusInternalServerError)
    } else {
		result.Thumbnail = UploadImage(image)
	}


	a.storage.NewPrefab(&result)

	
	writeJson(w, http.StatusOK, result)
}


func (a *Api) handleSearch(w http.ResponseWriter, r *http.Request) {

	name := r.URL.Query().Get("name")
	category := r.URL.Query().Get("category")
	sortingQ := r.URL.Query().Get("sort")
	page := r.URL.Query().Get("page")
	name = strings.TrimSpace(name)

	sorting := "desc";
	if sortingQ == "old" {
		sorting = "asc"
	}

	pageNumber, err := strconv.Atoi(page)
	if err != nil {
		pageNumber = 0
	}
	

	
	query := `select id, name, category, creator, link, description, thumbnail, added, count(id) over() as pages from prefabs`

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
	const limit = 15;
	query += fmt.Sprintf(" limit %d offset %d", limit, pageNumber * limit)

	rows, err := a.storage.db.Query(
		query,
		args...)


	if err != nil {
		log.Println(err)
		writeJson(w, http.StatusBadRequest, "")
		return 
	}
	defer rows.Close()
		
	results := []Prefab{}
	
	pages := 0
	for rows.Next() {
		p := Prefab{}
		err = rows.Scan(&p.Id, &p.Name, &p.Category, &p.Creator, &p.Link, &p.Description, &p.Thumbnail, &p.Added, &pages)
		if err != nil {
			log.Println(err)
		} else {
			results = append(results, p)
		}
	}

	log.Printf("Searching for name: %s, category: %s; found: %d results", name, category, len(results))

	result := SearchResult{
		Results: results,
		Pages: pages / limit,
	}

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