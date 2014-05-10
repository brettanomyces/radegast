package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"log"

	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"

	"github.com/gorilla/mux"
)

var (
	session    *mgo.Session
	collection *mgo.Collection
)

type Recipe struct {
	Id      bson.ObjectId `bson:"_id" json:"id, omitempty"`
	Name    string        `bson:"name" json:"name"`
	Created time.Time     `bson:"created" json:"created"`
	Style   string        `bson:"style" json:"style"`
}

type Recipes struct {
	Recipes []Recipe `json:"recipes"`
}

func main() {

	var err error

	log.Println("Starting Server")

	r := mux.NewRouter()
	// API URLs
	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", RetrieveRecipeHandler).Methods("GET")
	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", UpdateRecipeHandler).Methods("PUT")
	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", DeleteRecipeHandler).Methods("DELETE")
	r.HandleFunc("/api/recipes", CreateRecipeHandler).Methods("POST")
	r.HandleFunc("/api/recipes", RetrieveRecipeListHandler).Methods("GET")

	// WebApp URLs
	r.HandleFunc("/recipes/{id:[0-9a-z]{24}}", AppHandler).Methods("GET")

	// Resources
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("static/")))

	http.Handle("/", r)

	log.Println("Starting mongo db session")
	// MongoDB
	session, err = mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection = session.DB("radegast").C("recipes")

	log.Println("Listening on 8080")
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

func CreateRecipeHandler(w http.ResponseWriter, r *http.Request) {
	var recipe Recipe

	err := json.NewDecoder(r.Body).Decode(&recipe)
	if err != nil {
		panic(err)
	}

	recipe.Id = bson.NewObjectId()
	recipe.Name = "test"
	recipe.Created = time.Now()

	err = collection.Insert(&recipe)
	if err != nil {
		panic(err)
	} else {
		log.Printf("Inserted new recipe %s with name %s", recipe.Id, recipe.Name)
	}

	j, err := json.Marshal(recipe)
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
}

func RetrieveRecipeHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	if bson.IsObjectIdHex(vars["id"]) {
		var result Recipe
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

func RetrieveRecipeListHandler(w http.ResponseWriter, r *http.Request) {
	var recipes []Recipe

	iter := collection.Find(nil).Iter()
	result := Recipe{}
	for iter.Next(&result) {
		recipes = append(recipes, result)
	}

	j, err := json.Marshal(Recipes{Recipes: recipes})
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
	log.Println("provided json")
}

func UpdateRecipeHandler(w http.ResponseWriter, r *http.Request) {
	var err error
	// Gran the recipe id from the incoming url
	vars := mux.Vars(r)
	id := bson.ObjectIdHex(vars["id"])

	// Decode the indoming recipe json
	var recipe Recipe
	err = json.NewDecoder(r.Body).Decode(&recipe)
	if err != nil {
		log.Printf("Failed to decode request body for recipe %s", id)
		w.WriteHeader(http.StatusInternalServerError)
	}

	//Update the database
	b, err := bson.Marshal(recipe)
	if err != nil {
		log.Printf("Failed to marshal bson for recipe %s", id)
		w.WriteHeader(http.StatusInternalServerError)
	}
	err = collection.Update(bson.M{"_id": id}, b)
	if err == nil {
		log.Printf("Updated recipe: %s %s", id, recipe.Name)
	} else {
		log.Printf("Failed to updated collection for recipe %s", id)
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusNoContent)
}

func DeleteRecipeHandler(w http.ResponseWriter, r *http.Request) {
	// Gran the recipe's id from the incoming url
	var err error
	vars := mux.Vars(r)
	id := vars["id"]

	// Remove it from database
	err = collection.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	if err != nil {
		log.Printf("Could not find recipe %s to delete", id)
	}
	w.WriteHeader(http.StatusNoContent)
}
