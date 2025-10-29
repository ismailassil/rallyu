#!/bin/bash

YELLOW='\033[1;33m'
GREEN='\033[1;32m'
NC='\033[0m'

ENV_MAPPINGS=(
	## Root
	"./env-script/.env:.env"

	## Backend
	"./env-script/.backend.env:app/backend/.env"

	# Frontend
	"./env-script/.frontend.env:app/frontend/.env"

	## Microservices
	"./env-script/.api-gateway.env:app/backend/api-gateway/.api-gateway.env"
	"./env-script/.auth.env:app/backend/ms-auth/.auth.env"
	"./env-script/.chat.env:app/backend/ms-chat/.chat.env"
	"./env-script/.game.env:app/backend/ms-game/.game.env"
	"./env-script/.tournament.env:app/backend/ms-tournament/.tournament.env"
	"./env-script/.matchmaking.env:app/backend/ms-matchmaking/.matchmaking.env"
	"./env-script/.notif.env:app/backend/ms-notif/.notif.env"

	## Logging & Monitoring
	"./env-script/.logging.env:devops/logging/.env"
	"./env-script/.monitoring.env:devops/monitoring/.env"
	"./env-script/mail.key:devops/monitoring/prometheus/mail.key"
)

copy_env_file() {
	local src="$1"
	local dest="$2"

	if [ -f "$src" ]; then
		cp "$src" "$dest"
		return 0
	else
		return 1
	fi
}

echo -e ${GREEN}"Starting to spread environment files [${YELLOW}${#ENV_MAPPINGS[@]} files${GREEN}]..."${NC}

# Remove existing .env files in target locations
count=0
for mapping in "${ENV_MAPPINGS[@]}"; do
	IFS=":" read -r _ dest <<< "$mapping"
	if [ -f "$dest" ]; then
		rm "$dest"
		count=$((count + 1))
	fi
done

echo -e ${GREEN}"Removed $count existing .env files."${NC}

# Copy new .env files to target locations
count=0
for mapping in "${ENV_MAPPINGS[@]}"; do
	IFS=":" read -r src dest <<< "$mapping"
	copy_env_file "$src" "$dest" && count=$((count + 1))
done

echo -e ${GREEN}"Successfully spread $count environment files."${NC}
