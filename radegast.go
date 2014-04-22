package main

import (
	"net/http"
	"os"
)

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

	err := http.ListenAndServe(":"+os.Getenv("PORT"), nil)
	if err != nil {
		panic(err)
	}

}
