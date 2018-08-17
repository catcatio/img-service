const request = require('request')
const im = require('imagemagick-stream')
const httpContext = require('express-http-context');
const MemoryStream = require('memory-stream')
const LRU = require("lru-cache")
  , options = {
    max: 500,
    length: (n, key) => { return n * 2 + key.length },
    dispose: (key, n) => { n.close() },
    maxAge: 1000 * 60 * 60 * 48 // 48 hours
  }
  , cache = LRU(options)

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

    console.log(reqId, '  resizing', url, size, quality)

    const md5Hash = md5(`${url}||${size}||${quality}}`)
    const cachedData = cache.get(md5Hash)
    if (cachedData) {
      console.log(reqId, `  ${md5Hash}`, 'hit')
      const imgData = cachedData.imgData
      res.header('Content-Type', cachedData.contentType)
      res.send(imgData)
      return
    }
    console.log(reqId, `  ${md5Hash}`, 'missed')

    if (!url) {
      const message = 'url is empty'
      console.error(reqId, message)
      return res.status(400).send({ message })
    }

    const resize = im().resize(`${size}X${size}`).quality(quality)
    const ms = new MemoryStream()
    let contentType
    ms.on('finish', () => {
      const imgData = ms.get()
      cache.set(md5Hash, {
        imgData,
        contentType
      })
    })
    const resizePipe = request.get(url)
      .on('response', (response) => {
        console.log(reqId, '  content - type', response.headers['content-type'])
        contentType = response.headers['content-type']
        res.header('Content-Type', contentType)
      })
      .pipe(resize)
    resizePipe.pipe(res)
    resizePipe.pipe(ms)
  }
}

module.exports = resizeApi