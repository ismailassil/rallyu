## Install Docker Compose v2.30.0
curl -L "https://github.com/docker/compose/releases/download/v2.30.0/docker-compose-$(uname -s)-$(uname -m)" -o ~/goinfre/docker-compose-temp
chmod +x ~/goinfre/docker-compose-temp
mv -f ~/goinfre/docker-compose-temp ~/.docker/cli-plugins/docker-compose
