package lib

import (
	"time"

	"labix.org/v2/mgo/bson"
)

type Recipe struct {
	Id        bson.ObjectId `bson:"_id" json:"id, omitempty"`
	Name      string        `bson:"name" json:"name"`
	Created   time.Time     `bson:"created" json:"created"`
	Style     string        `bson:"style" json:"style"`
	Og		  float64		"og"
	Grains    []Grain       `bson:"grains" json:"grains"`
	Hops	  []Hop	        `bson:"hops" json:"hops"`
}

type Recipes struct {
	Recipes []Recipe `json:"recipes"`
}
