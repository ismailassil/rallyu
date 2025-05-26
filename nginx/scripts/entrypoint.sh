#!/bin/sh
set -e

export CERT_PATH="/certs/"
export HTPASSWD_PATH="/etc/nginx/.htpasswd"

if [ -z "${NGINX_METRICS_USER}" ] || [ -z "${NGINX_METRICS_PASSWORD}" ]; then
	echo "Error: NGINX_METRICS_USER and NGINX_METRICS_PASSWORD must be set."
	exit 1
fi

mkdir -p ${CERT_PATH}/private

if [ ! -f "${HTPASSWD_PATH}" ]; then
	htpasswd -b -c ${HTPASSWD_PATH} ${NGINX_METRICS_USER} ${NGINX_METRICS_PASSWORD}
	chmod 640 ${HTPASSWD_PATH}
	chown root:nginx ${HTPASSWD_PATH}
fi

if [ ! -f "${CERT_PATH}/private/wildcard.key" ] || [ ! -f "${CERT_PATH}/wildcard.crt" ]; then
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
