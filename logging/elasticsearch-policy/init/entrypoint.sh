#!/bin/sh

RED="\033[31m"
GREEN="\033[32m"
CYAN="\033[36m"
RESET="\033[0m"

until curl -s -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
	http://elasticsearch:9200/_cluster/health?pretty |
	grep -q '"status" : "green"'; do
	printf "${CYAN}Waiting for Elasticsearch to be ready...${RESET}\n"
	sleep 5
done

## Create ILM Policy 'logs_policy'
curl -s -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
	-X PUT "http://elasticsearch:9200/_ilm/policy/logs_policy" \
	-H 'Content-Type: application/json' \
	--data @/init/conf/ilm-policy.json

if [ $? -ne 0 ]; then
	printf "${RED}Creating ILM Policy Failed${RESET}\n"
	exit 1
fi

## Apply index template
curl -s -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
	-X PUT "http://elasticsearch:9200/_template/logs_template" \
	-H 'Content-Type: application/json' \
	--data @/init/conf/index-template.json

if [ $? -ne 0 ]; then
	printf "${RED}Applying Index Template Failed${RESET}\n"
	exit 1
fi

printf "\n${GREEN}Elasticsearch initialization completed successfully${RESET}\n"

# CONTAINER__ID=$(hostname)

# DAEMON_URL="http://localhost/containers/${CONTAINER__ID}?force=true"

# curl -s -X DELETE "${DAEMON_URL}" --unix-socket /var/run/docker.sock

# if [ $? -ne 0 ]; then
# 	printf "FAILED"
# fi
