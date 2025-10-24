# ********************** #
# ***   Makefile     *** #
# ********************** #

all: help

env:
	@bash ./env-script/spread-env.sh

docker:
	@if ! docker-compose -v | grep 2.30.0; then bash install-docker.sh; fi

up: docker env
	@docker-compose up --build --watch

down:
	@docker-compose down

clean:
	@docker-compose down -v

ps:
	@docker-compose ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

fclean:
	@docker-compose down -v --rmi all || true
	@docker volume rm `docker volume ls -q` 2>/dev/null || true
	@docker network prune -f 2>/dev/null || true

re: clean up

prune: fclean
	@docker system prune -a --volumes -f

.PHONY: all up clean fclean re prune

help:
	@echo "Makefile for RALLYU Deployment"
	@echo "Usage:"
	@echo "  make env      - Set up environment variables"
	@echo "  make docker   - Set up docker-compose with compatible version [2.30]"
	@echo "  make up       - Start all services in detached mode"
	@echo "  make ps       - List all none-run & running containers"
	@echo "  make clean    - Stop and remove all containers and volumes"
	@echo "  make fclean   - Stop and remove all containers, volumes, and images"
	@echo "  make re       - Clean, then start the all services"
	@echo "  make prune    - Clean and remove unused images and volumes"
