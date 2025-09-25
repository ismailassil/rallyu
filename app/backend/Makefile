all:
	@echo "'make up' to run all containers"
	@echo "'make down' to stop all containers"
	@echo "'make clean' to clean everything"

up:
	docker-compose -f './compose.backend.yaml' up -d --build

down:
	docker-compose -f './compose.backend.yaml' down

ps:
	@docker-compose -f './compose.backend.yaml' ps --format 'table {{.Name}}\t{{.Ports}}\t{{.Status}}'

re: down up

clean:
	@if [ -n "$$(docker ps -aq)" ]; then \
		docker rm -f $$(docker ps -aq); \
	fi
	@if [ -n "$$(docker images -q)" ]; then \
		docker rmi -f $$(docker images -q); \
	fi
