# vuejs3-test-user-login

This is the repository for the test solution

## Quickstart

- Instal all dependencies
  ```bash
  yarn install
  ```
- ### Build sources to `projectRoot/dist` folder

  - for development mode
    ```bash
    yarn dev
    ```
  - for production
    ```bash
    yarn build
    ```
  - run database server
    ```bash
    yarn db
    ```
  - Open in your browser `projectRoot/dist` folder
  - For production build there is generated report of bundled depedencies, see `projectRoot/dist/report.html`

<!-- - ### Simple alternative - run webpack dev server
  ```bash
  yarn serve
  ```
  this will start database server and launch browser automatically at the server url `http://localhost:9090/` -->

## Usage

There are 2 registered users (see json database file `db.json`)

- admin, password: 123456
- user, password: qwerty

## Database Server

Use json-server api for custom routing, authorization of users, sha256 token generation:

- authorization handler
  ```javascript
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
  ```
- data request handler for authorized users

  ```javascript
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
  ```

- database server is available at `https://localhost:3000`
  - generate token: `http://localhost:3000/authorize?login=admin&password=123456`
  - request contacts: `http://localhost:3000/contacts?user=admin&token=token`, see token generated above
