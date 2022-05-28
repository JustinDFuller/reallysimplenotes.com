export PORT=9000

server:
	@go run main.go;

build:
	@curl "http://localhost:9000?production=true" > build.html;

deploy: build
	@gcloud app deploy;
