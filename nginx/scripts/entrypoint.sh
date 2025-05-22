#!/bin/sh

export CERT_PATH="/etc/nginx/ssl"

mkdir -p ${CERT_PATH}/private

if [ -z "$(ls -A ${CERT_PATH})/private" ]; then
	echo "Generating Wildcard SSL Certificate..."
	openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
		-keyout ${CERT_PATH}/private/wildcard.key \
		-out ${CERT_PATH}/wildcard.crt \
		-subj '/C=MA/ST=BM_KNF/L=KH/O=1337/OU=IT/CN=*.localhost' \
		-addext 'subjectAltName=DNS:*.localhost,DNS:localhost'

	chmod 400 ${CERT_PATH}/private/wildcard.key
	chmod 644 ${CERT_PATH}/wildcard.crt

	chown -R nginx:nginx ${CERT_PATH}

	echo "Wildcard SSL Certificate generated successfully."
else
	echo "Wildcard SSL Certificate already exists. Skipping generation."
fi

echo "Starting Nginx..."
nginx -g "daemon off;"
