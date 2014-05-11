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
	Grains    []Grain       `bson:"grains" json:"grains"`
}

type Recipes struct {
	Recipes []Recipe `json:"recipes"`
}
