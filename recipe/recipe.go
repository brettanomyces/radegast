package recipe

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/brettanomyces/radegast/grain"
	"github.com/brettanomyces/radegast/hop"
	"github.com/gorilla/mux"

	"log"

	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
)

type Recipe struct {
	Id        bson.ObjectId `bson:"_id" json:"id, omitempty"`
	Name      string        `json:"name"`
	BatchSize int           `json:"batchSize"`
	Created   time.Time     `json:"created"`
	Style     string        `json:"style"`
	Og        float64       `json:"og,string"`
	Grains    []grain.Grain `json:"grains"`
	Hops      []hop.Hop     `json:"hops"`
}

type Recipes struct {
	Recipes []Recipe `json:"recipes"`
}

var (
	session    *mgo.Session
	collection *mgo.Collection
)

func SetupHandlers(s *mgo.Session, r *mux.Router) {
	session = s
	collection = session.DB("radegast").C("recipes")

	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", GetRecipeHandler).Methods("GET")
	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", PutRecipeHandler).Methods("PUT")
	r.HandleFunc("/api/recipes/{id:[0-9a-z]{24}}", DeleteRecipeHandler).Methods("DELETE")
	r.HandleFunc("/api/recipes", PostRecipeHandler).Methods("POST")
	r.HandleFunc("/api/recipes", GetRecipeListHandler).Methods("GET")
}

func PostRecipeHandler(w http.ResponseWriter, r *http.Request) {
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

func GetRecipeHandler(w http.ResponseWriter, r *http.Request) {

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

func GetRecipeListHandler(w http.ResponseWriter, r *http.Request) {
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

func PutRecipeHandler(w http.ResponseWriter, r *http.Request) {
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

	err = collection.Update(bson.M{"_id": id}, recipe)
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
