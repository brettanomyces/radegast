package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"log"

	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"

	"github.com/brettanomyces/radegast/data"
)

func SetupHandlers(r *mux.Router, resource string) {

	r.HandleFunc("/api/"+resource+"/{id}", makeHandler(getIdHandler, resource)).Methods("GET")
	r.HandleFunc("/api/"+resource, makeHandler(getHandler, resource)).Methods("GET")
	r.HandleFunc("/api/"+resource+"/{id}", makeHandler(putHandler, resource)).Methods("PUT")
	r.HandleFunc("/api/"+resource+"/{id}", makeHandler(deleteHandler, resource)).Methods("DELETE")
	r.HandleFunc("/api/"+resource, makeHandler(postHandler, resource)).Methods("POST")
}

func makeHandler(fn func(http.ResponseWriter, *http.Request, string), resource string) http.HandlerFunc {

	// closure so each handler has its own resource string
	return func(w http.ResponseWriter, r *http.Request) {
		// some validation can be put here
		fn(w, r, resource)
	}
}

func postHandler(w http.ResponseWriter, r *http.Request, collection string) {

	// err := json.NewDecoder(r.Body).Decode(&result)
	result := map[string]interface{}{
		"_id": bson.NewObjectId(),
	}

	err := data.WithCollection(collection, func(c *mgo.Collection) error {
		return c.Insert(&result)
	})
	if err != nil {
		log.Println("Failed to create resource")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	j, err := json.Marshal(result)
	if err != nil {
		log.Println("Failed to parse DB response")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
}

func getIdHandler(w http.ResponseWriter, r *http.Request, collection string) {

	vars := mux.Vars(r)
	if bson.IsObjectIdHex(vars["id"]) {
		var result interface{}
		id := bson.ObjectIdHex(vars["id"])
		err := data.WithCollection(collection, func(c *mgo.Collection) error {
			return c.Find(bson.M{"_id": id}).One(&result)
		})
		if err != nil {
			log.Printf("Failed to get _id: %s \n", id)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		j, err := json.Marshal(result)
		if err != nil {
			log.Println("Failed to parse DB response")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(j)
	} else {
		w.WriteHeader(http.StatusBadRequest)
	}
}

func getHandler(w http.ResponseWriter, r *http.Request, collection string) {
	var result []interface{}

	err := data.WithCollection(collection, func(c *mgo.Collection) error {
		iter := c.Find(nil).Iter()
		return iter.All(&result)
	})
	if err != nil {
		log.Println("Failed to get resources")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	j, err := json.Marshal(result)
	if err != nil {
		log.Println("Failed to parse DB response")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
	log.Println("provided json")
}

func putHandler(w http.ResponseWriter, r *http.Request, collection string) {
	var err error

	// Decode the indoming resource json
	var resource interface{}
	err = json.NewDecoder(r.Body).Decode(&resource)
	// if we want to access the values: m := resource.(map[string]interface{})
	if err != nil {
		log.Println("Failed to decode request body")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	vars := mux.Vars(r)
	id := bson.ObjectIdHex(vars["_id"])
	err = data.WithCollection(collection, func(c *mgo.Collection) error {
		return c.Update(bson.M{"_id": id}, resource)
	})
	if err != nil {
		log.Println("Failed to update database")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func deleteHandler(w http.ResponseWriter, r *http.Request, collection string) {
	vars := mux.Vars(r)
	id := vars["id"]

	// Remove it from database
	err := data.WithCollection(collection, func(c *mgo.Collection) error {
		return c.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	})

	if err != nil {
		log.Printf("Failed to delete _id: %s \n", id)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
