# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: iassil <iassil@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/05/18 14:42:56 by iassil            #+#    #+#              #
#    Updated: 2025/05/18 15:04:48 by iassil           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all: help

up:
	@docker compose up -d

clean:
	@docker compose down -v

fclean:
	@docker compose down -v --rmi all
	@docker volume rm $(shell docker volume ls -q)
	@docker network prune -f

re: clean up

prune: fclean
	@docer system prune -a --volumes -f

.PHONY: all up clean fclean re prune

help:
	@echo "Makefile for ELK Stack Deployment"
	@echo "Usage:"
	@echo "  make up       - Start the containers in detached mode"
	@echo "  make clean    - Stop and remove the containers and volumes"
	@echo "  make fclean   - Stop and remove the containers, volumes, and images"
	@echo "  make re       - Clean and then start the containers"
	@echo "  make prune    - Clean and remove unused images and volumes"