curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o ~/goinfre/docker-compose-temp
chmod +x ~/goinfre/docker-compose-temp
mv ~/goinfre/docker-compose-temp ~/.docker/cli-plugins/docker-compose
