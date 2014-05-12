package lib

import (
	"time"

	"labix.org/v2/mgo/bson"
)

type Recipe struct {
	Id        bson.ObjectId `bson:"_id" json:"id, omitempty"`
	Name      string		`json:"name"`
	BatchSize int `json:"batchSize"`
	Created   time.Time `json:"created"`
	Style     string `json:"style"`
	Og		  float64		`json:"og,string"`
	Grains    []Grain `json:"grains"`
	Hops	  []Hop `json:"hops"`
}

type Recipes struct {
	Recipes []Recipe `json:"recipes"`
}
