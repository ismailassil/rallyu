# ********************** #
# ***   Makefile     *** #
# ********************** #

all: help

env:
	@bash ./env-script/spread-env.sh

up: env
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
	@docer system prune -a --volumes -f

.PHONY: all up clean fclean re prune

help:
	@echo "Makefile for RALLYU Deployment"
	@echo "Usage:"
	@echo "  make env      - Set up environment variables"
	@echo "  make up       - Start the containers in detached mode"
	@echo "  make clean    - Stop and remove the containers and volumes"
	@echo "  make fclean   - Stop and remove the containers, volumes, and images"
	@echo "  make re       - Clean and then start the containers"
	@echo "  make prune    - Clean and remove unused images and volumes"
