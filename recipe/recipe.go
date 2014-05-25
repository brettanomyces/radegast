package recipe

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

func postHandler(w http.ResponseWriter, r *http.Request, resource string) {

	// err := json.NewDecoder(r.Body).Decode(&result)
	result := map[string]interface{}{
		"_id": bson.NewObjectId(),
	}

	s := data.GetSession()
	err := s.DB("radegast").C(resource).Insert(&result)

	if err != nil {
		panic(err)
	}

	j, err := json.Marshal(result)
	if err != nil {
		panic(err)
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
			panic(err)
		}

		j, err := json.Marshal(result)
		if err != nil {
			panic(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(j)
	} else {
		w.WriteHeader(http.StatusNoContent)
	}
}

func getHandler(w http.ResponseWriter, r *http.Request, collection string) {
	var result []interface{}

	err := data.WithCollection(collection, func(c *mgo.Collection) error {
		iter := c.Find(nil).Iter()
		return iter.All(&result)
	})

	if err != nil {
		panic(err)
	}

	j, err := json.Marshal(result)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
	log.Println("provided json")
}

func putHandler(w http.ResponseWriter, r *http.Request, collection string) {
	var err error
	// Gran the recipe id from the incoming url
	vars := mux.Vars(r)
	id := bson.ObjectIdHex(vars["id"])

	// Decode the indoming recipe json
	var recipe interface{}
	err = json.NewDecoder(r.Body).Decode(&recipe)
	// if we want to access the values: m := recipe.(map[string]interface{})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	err = data.WithCollection(collection, func(c *mgo.Collection) error {
		return c.Update(bson.M{"_id": id}, recipe)
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
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
		panic(err)
	}
	w.WriteHeader(http.StatusNoContent)
}
