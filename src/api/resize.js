const request = require('request')
const im = require('imagemagick-stream')
var httpContext = require('express-http-context');

const resizeApi = () => {
  return (req, res) => {
    const reqId = httpContext.get('reqId')
    console.log(reqId, 'start resizeApi')
    const startTime = Date.now()

    res.on('finish', () => {
      console.log(reqId, `end  resizeApi\t(${Date.now() - startTime} ms)`)
    })

    res.on('error', (err) => {
      console.log(reqId, err)
    })

    const url = req.query.url
    const size = parseInt(req.query.size) || 512
    const quality = parseInt(req.query.quality) || 75

    if (!url) {
      const message = 'url is empty'
      console.error(reqId, message)
      return res.status(400).send({ message })
    }

    console.log(reqId, '  resizing', url, size, quality)
    const resize = im().resize(`${size}x${size}`).quality(quality)
    request.get(url)
      .on('response', (response) => {
        res.header('Content-Type', response.headers['content-type']);
      })
      .pipe(resize)
      .pipe(res)
  }
}

module.exports = resizeApi