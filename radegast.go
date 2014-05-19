package main

import (
	"io/ioutil"
	"net/http"

	"log"

	"labix.org/v2/mgo"

	"github.com/brettanomyces/radegast/recipe"
	"github.com/gorilla/mux"
)

func main() {

	// MongoDB
	session, err := mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)

	router := mux.NewRouter()
	// API URLs
	recipe.SetupHandlers(session.Copy(), router)
	// grain.setupHandlers(session.Copy(), &router)

	// WebApp URLs
	router.HandleFunc("/recipes/{id:[0-9a-z]{24}}", AppHandler).Methods("GET")

	router.PathPrefix("/").Handler(http.FileServer(http.Dir("static/")))

	http.Handle("/", router)
	// Static Resources
	//fileServer := http.StripPrefix("/static/", http.FileServer(http.Dir("static")))
	//http.Handle("/", fileServer)

	http.ListenAndServe(":8080", nil)
}

func AppHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling url: %s", r.URL.String())
	// TODO load file into memory once. Left like this for now for testing
	index, err := ioutil.ReadFile("static/index.html")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "text/html")
		w.Write(index)
	}
}
