package recipe

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"log"

	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
)

var (
	session    *mgo.Session
	collection *mgo.Collection
)

func SetupHandlers(s *mgo.Session, r *mux.Router) {
	session = s
	collection = session.DB("radegast").C("recipes")

	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", GetResource).Methods("GET")
	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", PutResource).Methods("PUT")
	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", DeleteResource).Methods("DELETE")
	r.HandleFunc("/api/recipes", PostResource).Methods("POST")
	r.HandleFunc("/api/recipes", GetResources).Methods("GET")
}

func PostResource(w http.ResponseWriter, r *http.Request) {

	// err := json.NewDecoder(r.Body).Decode(&result)
	result := map[string]interface{}{
		"_id": bson.NewObjectId(),
	}

	err := collection.Insert(&result)
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

func GetResource(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	if bson.IsObjectIdHex(vars["id"]) {
		var result interface{}
		id := bson.ObjectIdHex(vars["id"])
		err := collection.Find(bson.M{"_id": id}).One(&result)
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

func GetResources(w http.ResponseWriter, r *http.Request) {
	var result []interface{}

	iter := collection.Find(nil).Iter()
	err := iter.All(&result)
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

func PutResource(w http.ResponseWriter, r *http.Request) {
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

	err = collection.Update(bson.M{"_id": id}, recipe)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusNoContent)
}

func DeleteResource(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	// Remove it from database
	err := collection.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	if err != nil {
		panic(err)
	}
	w.WriteHeader(http.StatusNoContent)
}
