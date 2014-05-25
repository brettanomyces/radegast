package data

import (
	"labix.org/v2/mgo"
)

var (
	s *mgo.Session
)

// singleton
func GetSession() *mgo.Session {
	if s == nil {
		var err error
		s, err = mgo.Dial("localhost")
		s.SetMode(mgo.Monotonic, true)
		if err != nil {
			panic(err)
		}
	}
	return s.Copy()
}

func WithCollection(collection string, fn func(*mgo.Collection) error) error {
	s := GetSession()
	defer s.Close()
	c := s.DB("radegast").C(collection)
	return fn(c)
}
