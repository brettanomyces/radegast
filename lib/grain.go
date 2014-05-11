package lib

type Grain struct {
	Name  string `bson:"name" json:"name"`
	Ebc   string `bson:"ebc" json:"ebc"`
	Grams string `bson:"grams" json:"grams"`
}

type Grains struct {
	Grains []Grain `json:"grains"`
}
