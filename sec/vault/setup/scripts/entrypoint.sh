#!/bash/sh

set -e

VAULT_ADDR=http://vault:8400/

until curl --fail -s $VAULT_ADDR/v1/sys/health; do sleep 2; done

## * The `Vault server` must be started with its configuration before it can be initialized
## ! Initialize Vault
cat <<EOF >payload.json
{
	"secret_shares": 1,
	"secret_threshold": 1
}
EOF

INIT_RESPONSE=$(curl --fail -s -X PUT \
	--data @payload.json \
	$VAULT_ADDR/v1/sys/init)

# Parse the output and store and Unseal and Root Token Keys
UNSEAL_KEY=$(echo $INIT_RESPONSE | jq -r ".keys[0]")
ROOT_KEY=$(echo $INIT_RESPONSE | jq -r ".root_token")

## Saving ROOT_KEY for other containers
echo $ROOT_KEY >/vault/rootKey

## ! Unseal the Vault
curl --fail -s -X POST \
	--data "{\"key\": \"$UNSEAL_KEY\"}" \
	$VAULT_ADDR/v1/sys/unseal

############# DONE
#####################

## * Setup KV Vault engine
curl --fail -s -X POST \
	--header "X-Vault-Token: $ROOT_KEY" \
	--data '{"type": "kv"}' \
	$VAULT_ADDR/v1/sys/mounts/secret

## Write secrets to the endpoint
curl --fail -s -X POST \
	--header "X-Vault-Token: $ROOT_KEY" \
	--data "{\"myData\": \"NoData\"}" \
	$VAULT_ADDR/v1/sys/mounts/secret/didi

POLICY_NAME=custom-policy

## Create Policy and Submit it to /v1/sys/policies/acl/:policy-name
curl --fail -s -X POST \
	--header "X-Vault-Token: $ROOT_KEY" \
	--data @/vault/policy.hcl \
	$VAULT_ADDR/v1/sys/policies/acl/$POLICY_NAME

## Enable userpass
curl --fail -s -X POST \
	--header "X-Vault-Token: $ROOT_KEY" \
	--data "{"type":"userpass"}" \
	$VAULT_ADDR/v1/sys/auth/userpass

## Create user with password
curl --fail -s -X POST \
	--header "X-Vault-Token: $ROOT_KEY" \
	--data "{\"password\":\"$AUTH_PASSWORD\",\"token_policies\":\"$POLICY_NAME\"}" \
	$VAULT_ADDR/v1/sys/auth/userpass/users/$AUTH_USERNAME

######### Revoke the Root Token
#### to only use userpass
curl --fail -s -X POST \
	--header "X-Vault-Token: $ROOT_KEY" \
	$VAULT_ADDR/v1/auth/token/revoke-self
