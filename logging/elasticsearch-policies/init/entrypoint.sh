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

## Register Snapshot repository
## To trigger a snapshot to save your current indices you have to plan...
###
### curl ... -X PUT "http://elasticsearch:9200/_snapshot/my_backup/snapshot_$(date +%Y%m%d%H%M%S)?wait_for_completion=true"
###
# curl -u ${ELASTIC_USERNAME}:${ELASTIC_PASSWORD} \
# 	-X PUT "http://elasticsearch:9200/_snapshot/my_backup" \
# 	-H 'Content-Type: application/json' \
# 	-d '{
# 		"type": "fs", # file system
# 		"settings": {
# 			"location": "/usr/share/elasticsearch/backups",
# 			"compress": true
# 		}
# 	}'

## Create ILM Policy
curl -u ${ELASTIC_USERNAME}:${ELASTIC_PASSWORD} \
	-X PUT "http://elasticsearch:9200/_ilm/policy/logs_policy" \
	-H 'Content-Type: application/json' \
	--data @/init/conf/ilm-policy.json

## Apply index template
curl -u ${ELASTIC_USERNAME}:${ELASTIC_PASSWORD} \
	-X PUT "http://elasticsearch:9200/_template/logs_template" \
	-h 'Content-Type: application/json' \
	--data @/init/conf/index-template.json
