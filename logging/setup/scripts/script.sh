#!/bin/bash

GREEN='\033[0;32m'
NC='\033[0m' # No Color

check_env_vars

echo -e "${GREEN}Starting setup tasks...${NC}"

if ! createCA || ! createCerts; then
	echo "Failed to create CA or certificates."
	exit 1
fi

setupFilePermissions

wait_for_elastic
check_status $?

setupKibanaConfig
check_status $?

echo -e "${GREEN}All setup tasks completed successfully.${NC}"
