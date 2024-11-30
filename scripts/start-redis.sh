echo "Make sure port 6379 is exposed."
PWD=$(openssl rand -base64 12 | tr '+/' '-_')
sed -i -e "s#:PWD@#:$PWD@#" .env
docker run -d \
    --name api_redis \
    -p 6379:6379 \
    -e REDIS_ARGS="--requirepass $PWD --user redis on >$PWD ~* allcommands --user default off nopass nocommands" \
    --restart="unless-stopped" \
    redis/redis-stack-server:latest