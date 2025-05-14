if [ x${ELASTIC_PASSWORD} == x ]; then
	echo "ELASTIC_PASSWORD is not set. Please set it in the .env file."
	exit 1
fi

if [ x${KIBANA_PASSWORD} == x ]; then
	echo "KIBANA_PASSWORD is not set. Please set it in the .env file."
	exit 1
fi

###########################################
###########################################
if [ ! -f config/certs/ca.zip ]; then
	echo "Creating CA..."
	bin/elasticsearch-certutil ca --pem --silent --keep-ca-key --out config/certs/ca.zip
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
		"  - name: es00\n" \
		"    dns:\n" \
		"      - es00\n" \
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
chown -R root:root config/certs
find . -type d -exec chmod 750 \{\} \;
find . -type f -exec chmod 640 \{\} \;

###########################################
###########################################
echo "Waiting for Elasticsearch to start..."
until curl -s --cacert config/certs/ca/ca.crt https://es00:9200 | grep -q "missing authentication credentials"; do sleep 10; done

###########################################
###########################################
echo "Setting up Kibana System Password..."
until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" \
	-H "Content-Type: application/json" https://es00:9200/_security/user/kibana_system/_password \
	-d "{\"password\":\"${KIBANA_PASSWORD}\"}" | grep -q "^{}"; do sleep 10; done

echo "Kibana System Password set."
