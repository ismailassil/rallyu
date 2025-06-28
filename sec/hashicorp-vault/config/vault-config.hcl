ui = true
api_addr = "http://localhost:8400"

listener "tcp" {
	address = "0.0.0.0:8400"
	tls_disable = true
}

# Default Persistent Storage
storage "raft" {
	path = "./vault/data"
	node = "rallyu"
}
cluster_addr = "http://127.0.0.1:8401"

disable_mlock = true
