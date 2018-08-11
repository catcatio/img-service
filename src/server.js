


module.exports = (config) => {
  const start = async () => {
    const { resizeApi } = require('./api')

    const app = require('express')()
    const cors = require('cors')({ origin: true })
    const httpContext = require('express-http-context').middleware
    app.use(cors)
    app.use(httpContext)
    app.use(require('./middleware/request-id'))
    app.get('/resize', resizeApi())

    app.listen(config.port, (err) => {
      if (err) {
        return console.log('Failed to start server: ', err)
      }

      console.log(`Server started on port ${config.port}`)
    })
  }

  return {
    start
  }
}