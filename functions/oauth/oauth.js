const isLocal = process.env.NETLIFY_LOCAL === 'true'
require('dotenv').config({ path: __dirname + (isLocal ? '/.env.local' : '/.env') })

const fetch = require('node-fetch')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

function errorWithCode(code, msg) {
  const e = new Error(msg)
  e.code = code
  return e
}

async function authenticate(code) {
  if (!code) {
    throw errorWithCode(400, `?code= parameter must be set. Received "${code}"`)
  }
  if (!CLIENT_ID) {
    throw errorWithCode(400, `CLIENT_ID environment variables must be set. Found "${CLIENT_ID}"`)
  }
  if (!CLIENT_SECRET) {
    throw errorWithCode(400, `CLIENT_SECRET environment variables must be set. Found "${CLIENT_SECRET}"`)
  }

  const url = 'https://github.com/login/oauth/access_token'
  const body = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code
  }
  console.log(body)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  let data = await res.text()
  try {
    data = JSON.parse(data)
    if (data.error) {
      throw errorWithCode(500, data.error)
    }
  } catch (err) {
    throw errorWithCode(500, `Can't process response ${data}`)
  }

  return data
}

exports.handler = async function (req, context) {
  const code = req.queryStringParameters.code

  try {
    const data = await authenticate(code)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (err) {
    return {
      statusCode: err.code || 500,
      body: JSON.stringify({ code: err.code, error: err.message })
    }
  }
};