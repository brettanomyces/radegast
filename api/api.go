package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
)

type Recipe struct {
	Id   bson.ObjectId `bson:"_id" json:"id"`
	Name string        `json:"name"`
}

type Grain struct {
	Id   bson.ObjectId `bson:"_id" json:"id"`
	Name string        `json:"name"`
}

var (
	session          *mgo.Session
	recipeCollection *mgo.Collection
	grainCollection  *mgo.Collection
)

func SetupHandlers(s *mgo.Session, r *mux.Router) {
	session = s
	recipeCollection = session.DB("radegast").C("recipes")
	grainCollection = session.DB("radegast").C("grains")

	r.HandleFunc("/api/{resource:[a-z]+}/{id:[0-9a-z]{24}}", getHandler).Methods("GET")
	// r.HandleFunc("/api/{resource:[a-z]+}/{id:[0-9a-z]{24}}", putHandler).Methods("PUT")
	// r.HandleFunc("/api/{resource:[a-z]+}/{id:[0-9a-z]{24}}", postHandler).Methods("POST")
	// r.HandleFunc("/api/{resource:[a-z]+}/{id:[0-9a-z]{24}}", deleteHandler).Methods("DELETE")
}

func getStruct(resource string) (interface{}) {
	switch resource {
	case "grain":
		return Grain
	case "recipe":
		return recipe Recipe
	default:
	}
}

func getHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	result = getStruct(vars["resource"])

}
