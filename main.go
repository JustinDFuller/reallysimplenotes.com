package main

import (
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"
	"text/template"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if strings.Contains(r.URL.Path, "/public") {
			path := fmt.Sprintf(".%s", r.URL.Path)
			log.Printf("Serving static file: %s", path)
			http.ServeFile(w, r, path)
			return
		}

		var t = template.Must(template.New("main.template.html").ParseFiles("main.template.html"))

		var css []byte
		var js []byte

		dir := os.DirFS("./")
		cssGlob, err := fs.Glob(dir, "*.css")
		if err != nil {
			panic(err)
		}

		jsGlob, err := fs.Glob(dir, "*.js")
		if err != nil {
			panic(err)
		}

		for _, file := range cssGlob {
			b, err := fs.ReadFile(dir, file)
			if err != nil {
				panic(err)
			}

			css = append(css, b...)
		}

		for _, file := range jsGlob {
			b, err := fs.ReadFile(dir, file)
			if err != nil {
				panic(err)
			}

			js = append(js, b...)
		}

		type data struct {
			CSS []byte
			JS  []byte
		}

		if err := t.Execute(w, &data{
			CSS: css,
			JS:  js,
		}); err != nil {
			log.Print(err)
		}
	})
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", os.Getenv("PORT")), nil))
}
