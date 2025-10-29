# ********************** #
# ***   Makefile     *** #
# ********************** #

all: help

env:
	@bash ./env-script/spread-env.sh

docker:
	@if ! docker-compose -v | grep 2.30.0; then bash install-docker.sh; fi

### All Project
up_all:
	@docker-compose -f './compose.all.yaml' up --build -d

down_all:
	@docker-compose -f './compose.all.yaml' down

clean_all:
	@docker-compose -f './compose.all.yaml' down -v

ps_all:
	@docker-compose -f './compose.all.yaml' ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

re_all: clean_all up_all

### Only the application
up_app: env
	@docker-compose up --build -d

down_app:
	@docker-compose down

clean_app:
	@docker-compose down -v

ps_app:
	@docker-compose ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

re_app: down_app up_app

### Only the devops
up_devops: docker env
	@docker-compose -f './devops/compose.devops.yaml' up --build -d

down_devops:
	@docker-compose -f './devops/compose.devops.yaml' down

clean_devops:
	@docker-compose -f './devops/compose.devops.yaml' down -v

ps_devops:
	@docker-compose -f './devops/compose.devops.yaml' ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

re_devops: down_devops up_devops

### For all
fclean: clean_devops clean_app
	@docker-compose down -v --rmi all || true
	@docker volume rm `docker volume ls -q` 2>/dev/null || true
	@docker network prune -f 2>/dev/null || true

prune:
	@docker system prune -a --volumes -f

.PHONY: all up clean fclean re prune help \
	up_app down_app clean_app ps_app re_app \
	up_devops down_devops clean_devops ps_devops re_devops \
	up_all down_all clean_all ps_all re_all

help:
	@echo "Makefile for RALLYU Deployment"
	@echo "Usage:"
	@echo "  make env            - Load environment variables from ./env-script/spread-env.sh"
	@echo "  make docker         - Install docker-compose version 2.30.0 if not present"
	@echo ""
	@echo "### Application Only"
	@echo "  make up_app         - Build and start the application services"
	@echo "  make down_app       - Stop the application services"
	@echo "  make clean_app      - Stop and remove application containers and volumes"
	@echo "  make ps_app         - List all application containers with status and ports"
	@echo "  make re_app         - Rebuild, stop, and restart application services"
	@echo ""
	@echo "### DevOps Only"
	@echo "  make up_devops      - Build and start DevOps services (from devops/compose.devops.yaml)"
	@echo "  make down_devops    - Stop DevOps services"
	@echo "  make clean_devops   - Stop and remove DevOps containers and volumes"
	@echo "  make ps_devops      - List all DevOps containers with status and ports"
	@echo "  make re_devops      - Rebuild, stop, and restart DevOps services"
	@echo ""
	@echo "### All Services"
	@echo "  make up_all         - Start both application and DevOps services"
	@echo "  make down_all       - Stop both application and DevOps services"
	@echo "  make clean_all      - Clean all containers and volumes for app and DevOps"
	@echo "  make re_all         - Clean and restart all services"
	@echo "  make fclean         - Clean all containers, volumes, and images"
	@echo "  make prune          - Remove unused images, volumes, and system data"
