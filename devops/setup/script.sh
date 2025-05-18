#!/bin/sh

set -e

if [ -z "${ELASTIC_PASSWORD}" ]; then
	echo "ELASTIC_PASSWORD is not set. Please set it in the .env file."
	exit 1
fi

if [ -z "${KIBANA_PASSWORD}" ]; then
	echo "KIBANA_PASSWORD is not set. Please set it in the .env file."
	exit 1
fi

###########################################
###########################################
if [ ! -f config/certs/ca.zip ]; then
	echo "Creating CA..."
	bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip
	unzip -o config/certs/ca.zip -d config/certs
	rm config/certs/ca.zip
	echo "CA created."
fi

###########################################
###########################################
if [ ! -f config/certs/certs.zip ]; then
	echo "Creating certificates..."
	echo -ne \
		"instances:\n" \
		"  - name: elasticsearch\n" \
		"    dns:\n" \
		"      - elasticsearch\n" \
		"      - localhost\n" \
		"    ip:\n" \
		"      - 127.0.0.1\n" \
		"  - name: logstash\n" \
		"    dns:\n" \
		"      - logstash\n" \
		"      - localhost\n" \
		"    ip:\n" \
		"      - 127.0.0.1\n" \
		"  - name: kibana\n" \
		"    dns:\n" \
		"      - kibana\n" \
		"      - localhost\n" \
		"    ip:\n" \
		"      - 127.0.0.1\n" \
		>config/certs/instances.yml

	bin/elasticsearch-certutil cert --silent --pem \
		-out config/certs/certs.zip \
		--in config/certs/instances.yml \
		--ca-cert config/certs/ca/ca.crt \
		--ca-key config/certs/ca/ca.key
	unzip config/certs/certs.zip -d config/certs
	rm config/certs/certs.zip
	rm config/certs/instances.yml
	echo "Certificates created."
fi

###########################################
###########################################
echo "Setting file permissions..."
chown -R 1000:0 config/certs
find config/certs -type d -exec chmod 750 \{\} \;
find config/certs -type f -exec chmod 640 \{\} \;

sleep 2

###########################################
###########################################
echo "Waiting for Elasticsearch to start..."
until curl -s --cacert config/certs/ca/ca.crt https://elasticsearch:9200 |
	grep -q "missing authentication credentials" || echo "Not Yet"; do sleep 5; done

###########################################
###########################################
echo "Setting up Kibana System Password..."
until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:securepassword" \
	-H "Content-Type: application/json" https://elasticsearch:9200/_security/user/kibana_system/_password \
	-d "{\"password\":\"securepassword\"}" | grep -q "^{}" || echo "Not Yet"; do sleep 5; done

echo "Kibana System Password set."
