#!/bin/sh

if [ -z "${NGINX_METRICS_USER}" ] || [ -z "${NGINX_METRICS_PASSWORD}" ]; then
	echo "Error: NGINX_METRICS_USER and NGINX_METRICS_PASSWORD must be set."
	exit 1
fi

htpasswd -b -c /etc/nginx/.htpasswd ${NGINX_METRICS_USER} ${NGINX_METRICS_PASSWORD}

if [ $? -ne 0 ]; then
	echo "Error: Failed to create htpasswd file."
	exit 1
fi

exec nginx -g "daemon off;"
