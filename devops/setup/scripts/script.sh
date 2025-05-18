#!/bin/bash

declare -i exit_code=0
declare -i max_retries=12

GREEN='\033[0;32m'
NC='\033[0m' # No Color

check_env_vars

echo -e "${GREEN}Starting setup tasks...${NC}"

if ! createCA || ! createCerts; then
	echo "Failed to create CA or certificates."
	exit 1
fi

setupFilePermissions

if ! wait_for_elastic; then
	exit_code=$?
	check_status "$exit_code"
fi

exit_code=0

if ! setupKibana; then
	exit_code=$?
	check_status "$exit_code"
fi

echo -e "${GREEN}All setup tasks completed successfully.${NC}"