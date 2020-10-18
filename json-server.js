const path = require('path')
const crypto = require('crypto')
const jsonServer = require('json-server')

const dbPath = path.join(__dirname, 'db.json')
const db = require(dbPath)
const tokens = {}

const server = jsonServer.create()
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.get('/authorize', (req, res) => {
  const { login, password } = req.query
  if (login && password) {
    let user = db.users.filter(
      (v) => v.login === login && v.password === password
    )
    if (user.length) {
      user = user[0]
      const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(user) + Date.now())
        .digest('hex')
      tokens[user.login] = hash
      console.log(
        'authorization of user = %s, token = %s',
        user.login,
        hash,
        tokens
      )
      res.jsonp({ authorized: true, token: hash })
    } else {
      console.log('authorization of user %s failed', user.login, tokens)
      res.jsonp({ error: 'User is not found' })
    }
  }
})

server.get('/contacts', (req, res) => {
  const { token, user } = req.query
  if (tokens[user] && tokens[user] === token) {
    console.log('authorised user %s asks contacts...', user, db.contacts)
    res.jsonp({ data: db.contacts })
  } else {
    console.log('unauthorised user %s asks contacts!', user)
    res.jsonp({ error: 'Access denied!' })
  }
})

// server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running')
})
