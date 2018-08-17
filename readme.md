# img-service

Image editing services

## Prerequisite

- [imagemagick](https://www.imagemagick.org/script/install-source.php)
- `.env` file, see more info in `.env.sample`

## Development

```bash
npm i
npm run dev

```

## Container

```bash
docker-compose up
```

## usage

### resize

To reize an image to a specified size

```bash
curl http://localhost:3000/resize?size=480&quality=90&url=https://www.imagemagick.org/image/wizard.png -o output.png
```

## Performance tuning

- Use [`node-lru-cache`](https://github.com/isaacs/node-lru-cache) to store processed image, its option set to 500 max item for 7 days