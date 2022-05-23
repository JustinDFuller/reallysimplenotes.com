export PORT=9000

server:
	@go run main.go;

build:
	@curl "http://localhost:9000" > build.html;

deploy: build
	@gcloud app deploy;
