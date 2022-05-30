export PORT=9000

server:
	@go run main.go;

server-watch:
	@reflex -r "\.go" -s -- sh -c "$(MAKE) server";

build:
	@curl "http://localhost:9000?production=true" > build.html;

deploy: build
	@gcloud app deploy;
