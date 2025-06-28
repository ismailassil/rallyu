set -e

until curl -d http://vault:8200/v1/sys/health; do sleep 2; done

