export PORT=9000

server:
	@go run main.go;

deploy:
	@gcloud app deploy;
