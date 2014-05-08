package main

import (
	"encoding/json"
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
	Id      bson.ObjectId `bson:"_id" json:"id"`
	Name    string        `json:"name"`
	Created time.Time     `json:"created"`
}

type RecipeJSON struct {
	Recipe Recipe `json:"recipe"`
}

type RecipesJSON struct {
	Recipes []Recipe `json:"recipes"`
}

func main() {

	var err error

	log.Println("Starting Server")

	r := mux.NewRouter()
	r.HandleFunc("/api/recipes/{id:[0-9]+}", RetrieveRecipeHandler).Methods("GET")
	r.HandleFunc("/api/recipes/{id:[0-9]+}", UpdateRecipeHandler).Methods("PUT")
	r.HandleFunc("/api/recipes/{id:[0-9]+}", DeleteRecipeHandler).Methods("DELETE")
	r.HandleFunc("/api/recipes", CreateRecipeHandler).Methods("POST")
	r.HandleFunc("/api/recipes", RetrieveRecipeHandler).Methods("GET")
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

func CreateRecipeHandler(w http.ResponseWriter, r *http.Request) {
	var recipeJSON RecipeJSON

	err := json.NewDecoder(r.Body).Decode(&recipeJSON)
	if err != nil {
		panic(err)
	}

	recipe := recipeJSON.Recipe

	obj_id := bson.NewObjectId()
	recipe.Id = obj_id
	recipe.Name = "test"
	recipe.Created = time.Now().Local()

	err = collection.Insert(&recipe)
	if err != nil {
		panic(err)
	} else {
		log.Printf("Inserted new recipe %s with name %s", recipe.Id, recipe.Name)
	}

	j, err := json.Marshal(RecipeJSON{Recipe: recipe})
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
}

func RetrieveRecipeHandler(w http.ResponseWriter, r *http.Request) {
	var err error
	var j []byte

	vars := mux.Vars(r)

	if id, ok := vars["id"]; ok {
		var recipe Recipe
		err = collection.Find(id).One(&recipe)
		j, err = json.Marshal(RecipeJSON{Recipe: recipe})
		if err != nil {
			panic(err)
		}
	} else {
		var recipes []Recipe
		iter := collection.Find(nil).Iter()
		result := Recipe{}
		for iter.Next(&result) {
			recipes = append(recipes, result)
		}

		j, err = json.Marshal(RecipesJSON{Recipes: recipes})
		if err != nil {
			panic(err)
		}
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
	var recipeJSON RecipeJSON
	err = json.NewDecoder(r.Body).Decode(&recipeJSON)
	if err != nil {
		panic(err)
	}

	//Update the database
	err = collection.Update(bson.M{"_id": id},
		bson.M{"name": recipeJSON.Recipe.Name,
			"_id":     id,
			"created": recipeJSON.Recipe.Created,
		})
	if err == nil {
		log.Printf("Updated recipe %s name to %s", id, recipeJSON.Recipe.Name)
	} else {
		panic(err)
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
