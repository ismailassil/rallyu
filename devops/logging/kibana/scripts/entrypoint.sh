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

### Create an HTTPS Certicate
CERT_PATH='/usr/share/kibana/config/certs'
CERT_FILE_PATH=$CERT_PATH/kibana.crt
CERT_KEY_PATH=$CERT_PATH/kibana.key

echo $CERT_PATH $CERT_FILE_PATH $CERT_KEY_PATH

if [ ! -f "$CERT_FILE_PATH" ] || [ ! -f "$CERT_KEY_PATH" ]; then
	printf "${CYAN}Generating self-signed HTTPS certificate for Kibana...${RESET}\n"
	mkdir -p $CERT_PATH
	openssl req -x509 -nodes -days 365 \
		-newkey rsa:2048 \
		-keyout "$CERT_KEY_PATH" \
		-out "$CERT_FILE_PATH" \
		-subj "/C=MA/ST=KH/L=KH/O=Kibana/OU=IT/CN=kibana"
	chown -R kibana:kibana "$CERT_PATH"
	printf "${GREEN}Certificate created at ${CERT_PATH}${RESET}\n"
fi

export SERVER_SSL_ENABLED=true
export SERVER_SSL_CERTIFICATE="$CERT_FILE_PATH"
export SERVER_SSL_KEY="$CERT_KEY_PATH"
export SERVER_HOST=0.0.0.0

/usr/local/bin/kibana-docker &

until curl -k -s https://localhost:5601/api/status | grep -q '"level":"available"'; do
	printf "${CYAN}Waiting for Kibana to be ready...${RESET}\n"
	sleep 5
done

printf "${GREEN}Kibana is up${RESET}\n"

printf "${CYAN}Importing Dashboard -- 1${RESET}\n"
curl -k -s -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
	-X POST 'https://localhost:5601/api/saved_objects/_import' \
	-H 'kbn-xsrf: true' \
	-F file=@/dashboards/nginx-dashboard.ndjson

if [ $? -ne 0 ]; then
	printf "\n${RED}Dashboard -- 1 -- failed to import${RESET}"
fi

printf "\n${CYAN}Importing Dashboard -- 2${RESET}\n"
curl -k -s -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
	-X POST 'https://localhost:5601/api/saved_objects/_import?overwrite=true' \
	-H 'kbn-xsrf: true' \
	-F file=@/dashboards/nginx-logs-dashboard.ndjson

if [ $? -ne 0 ]; then
	printf "\n${RED}Dashboard -- 2 -- failed to import${RESET}"
fi

printf "\n${GREEN}All done!${RESET}\n"

wait
