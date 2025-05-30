#!/bin/sh

RED="\033[31m"
GREEN="\033[32m"
CYAN="\033[36m"
RESET="\033[0m"

set -e

if [ -z "${ELASTIC_USERNAME}" ] || [ -z "${ELASTIC_PASSWORD}" ]; then
	printf "${RED}Error: ELASTIC_USERNAME and ELASTIC_PASSWORD must be set.${RESET}\n"
	exit 1
fi

/usr/local/bin/kibana-docker &

until curl -s http://localhost:5601/api/status | grep -q '"level":"available"'; do
	printf "${CYAN}Waiting for Kibana to be ready...${RESET}\n"
	sleep 5
done

printf "${GREEN}Kibana is up${RESET}\n"

printf "${CYAN}Importing Dashboard -- 1${RESET}\n"
curl -s -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
	-X POST 'http://localhost:5601/api/saved_objects/_import' \
	-H 'kbn-xsrf: true' \
	-F file=@/dashboards/nginx-dashboard.ndjson

if [ $? -ne 0 ]; then
	printf "\n${RED}Dashboard -- 1 -- failed to import${RESET}"
fi

printf "\n${CYAN}Importing Dashboard -- 2${RESET}\n"
curl -s -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
	-X POST 'http://localhost:5601/api/saved_objects/_import?overwrite=true' \
	-H 'kbn-xsrf: true' \
	-F file=@/dashboards/nginx-logs-dashboard.ndjson

if [ $? -ne 0 ]; then
	printf "\n${RED}Dashboard -- 2 -- failed to import${RESET}"
fi

printf "\n${GREEN}All done!${RESET}\n"

wait
