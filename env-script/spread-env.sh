ENV_MAPPINGS = (
	## Root
	"./.env:../.env"

	## Backend
	"./.backend.env:../app/backend/.backend.env"

	## Microservices
	"./.api-gateway.env:../app/backend/api-gateway/.api-gateway.env"
	"./.auth.env:../app/backend/ms-auth/.auth.env"
	"./.chat.env:../app/backend/ms-chat/.chat.env"
	"./.game.env:../app/backend/ms-game/.game.env"
	"./.matchmaking.env:../app/backend/ms-matchmaking/.matchmaking.env"
	"./.notif.env:../app/backend/ms-notif/.notif.env"
	"./.xo.env:../app/backend/ms-xo/.xo.env"

	## Logging & Monitoring
	"./.logging.env:../logging/.logging.env"
	"./.monitoring.env:../monitoring/.monitoring.env"
)

copy_env_file() {
	local src="$1"
	local dest="$2"

	if [ -f "$src" ]; then
		cp "$src" "$dest"
		echo "Copied $src to $dest"
	else
		echo "Source file $src does not exist. Skipping."
	fi
}

# Remove existing .env files in target locations
for mapping in "${ENV_MAPPINGS[@]}"; do
	IFS=":" read -r _ dest <<< "$mapping"
	if [ -f "$dest" ]; then
		rm "$dest"
		echo "Removed existing file $dest"
	fi
done

# Copy new .env files to target locations
for mapping in "${ENV_MAPPINGS[@]}"; do
	IFS=":" read -r src dest <<< "$mapping"
	copy_env_file "$src" "$dest"
done

echo "Environment files have been spread successfully."

