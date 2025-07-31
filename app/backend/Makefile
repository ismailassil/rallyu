all:
	@echo "'make up' to run all containers"
	@echo "'make down' to stop all containers"
	@echo "'make clean' to clean everything"

up:
	docker-compose -f './compose.backend.yaml' up -d --build

down:
	docker-compose -f './compose.backend.yaml' down

clean:
	docker rm `docker ps -aq` -f
	docker image rm `docker images -q` -f
