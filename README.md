# HTTP Proxy
An HTTP Proxy with rate limit and statistics.

### Architecture
![Notification Flow](https://lucid.app/publicSegments/view/12d00273-6c20-40aa-9a99-e6de82723ea6/image.png "Notification Flow")

### Project dependencies

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup

1. Make sure you are using the correct Nodejs version: `nvm install`
2. Install project dependencies: `npm install`
3. Create the `.env` file and adjust it to match your needs: `cp .env.example .env`
4. Start the server with docker: `docker-compose up`

### Using the proxy

Once the proxy is up and running, you can run the following command to make sure it works.

```
$ curl -i http://localhost:8080/posts/1
```
