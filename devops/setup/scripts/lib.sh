#!/bin/bash

function check_env_vars {
	if [ -z "$ELASTIC_USERNAME" ] || [ -z "$ELASTIC_PASSWORD" ]; then
		echo "Error: " "ELASTIC_USERNAME and ELASTIC_PASSWORD must be set"
	fi
	if [ -z "$KIBANA_USERNAME" ] || [ -z "$KIBANA_PASSWORD" ]; then
		echo "Error: " "KIBANA_USERNAME and KIBANA_PASSWORD must be set"
	fi
}

function createCA {
	if [ ! -f config/certs/ca.zip ]; then
		echo "Creating CA..."
		bin/elasticsearch-certutil ca --silent --pem --out config/certs/ca.zip
		unzip -o config/certs/ca.zip -d config/certs
		echo "CA created successfully."
	else
		echo "CA already exists. Skipping CA creation."
	fi
}

function createCerts {
	if [ ! -f config/certs/certs.zip ]; then
		## Create the certificates for Kibana, Elasticsearch, and Logstash
		echo "Creating certificates..."
		mv /conf/instances.yml config/certs/certs.yml
		# Create the certificates
		# --pem: Create PEM files
		# --out: Output file
		# --in: Input file
		# --ca-cert: CA certificate
		# --ca-key: CA key
		# --silent: Suppress output
		bin/elasticsearch-certutil cert \
			--silent --pem -out config/certs/certs.zip \
			--in config/certs/certs.yml \
			--ca-cert config/certs/ca/ca.crt \
			--ca-key config/certs/ca/ca.key
		unzip -o config/certs/certs.zip -d config/certs
		echo "Certificates created successfully."
	else
		echo "Certificates already exist. Skipping certificate creation."
	fi
}

function setupFilePermissions {
	echo "Setting file permissions..."
	chown -R 1000:0 config/certs
	find config/certs -type d -exec chmod 750 \{\} \;
	find config/certs -type f -exec chmod 640 \{\} \;
	echo "File permissions set successfully."
}

function wait_for_elastic {
	local retries=0
	local max_retries=12
	local ELASTIC_HOST="https://elasticsearch:9200"

	echo "Waiting for Elasticsearch to start..."
	until curl -s --cacert config/certs/ca/ca.crt ${ELASTIC_HOST} | grep -q "missing authentication credentials"; do
		((retries++))
		if [ $retries -eq $max_retries ]; then
			echo "Error: " "Elasticsearch is not responding after $max_retries attempts."
			return $?
		fi
		echo "Waiting for Elasticsearch to start... (attempt $((retries))/$max_retries)"
		sleep 5
	done
	echo "Elasticsearch is up and running."
}

function setupKibana {
	local ELASTIC_HOST="https://elasticsearch:9200"
	local retries=0
	local max_retries=12

	echo "Setting up Kibana user and password..."
	until curl -s -X POST --cacert config/certs/ca/ca.crt \
		-u "$ELASTIC_USERNAME:$ELASTIC_PASSWORD" \
		-H "Content-Type: application/json" \
		"${ELASTIC_HOST}/_security/user/${KIBANA_USERNAME}/_password" \
		-d "{\"password\":\"$KIBANA_PASSWORD\"}" | grep -q "^{}"; do

		((retries++))
		if [ $retries -eq $max_retries ]; then
			echo "Error: " "Kibana setup failed after $max_retries attempts."
			return $?
		fi
		echo "Kibana setup failed. Retrying...(attempt $((retries))/$max_retries)"
		sleep 5
	done

	echo "Kibana setup completed."
}

function check_status {
	if (($1 != 0)); then
		case $1 in
		6)
			echo "Error: " 'Could not resolve host. Is Elasticsearch running?'
			;;
		7)
			echo "Error: " 'Failed to connect to host. Is Elasticsearch healthy?'
			;;
		28)
			echo "Error: " 'Timeout connecting to host. Is Elasticsearch healthy?'
			;;
		*)
			echo "Error: " "Connection to Elasticsearch failed. Exit code: $1"
			;;
		esac
		exit 1
	fi
}
