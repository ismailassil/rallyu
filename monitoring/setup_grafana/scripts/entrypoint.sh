#!/bin/sh

export GF_FOLDER="/grafana-ssl"

if [ -d "${GF_FOLDER}" ] && [ ! -z "$(ls -A ${GF_FOLDER})" ]; then
	exit 1
fi

echo "Creating Grafana folder at ${GF_FOLDER}"
mkdir -p ${GF_FOLDER}

echo "Setting up SSL certificate for Grafana"

openssl req -x509 -newkey rsa:4096 -sha256 \
	-out ${GF_FOLDER}/grafana.crt \
	-keyout ${GF_FOLDER}/grafana.key \
	-days 365 -nodes \
	-subj "/C=MA/ST=KH/L=KH/O=1337/OU=dev/CN=localhost"

echo "Setting permissions for Grafana folder"
chown -R 472:472 ${GF_FOLDER}
chmod 400 ${GF_FOLDER}

echo "SSL certificate generated and permissions set"
