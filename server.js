const fs = require('fs')
const path = require('path')
const http = require('http')
const { URL } = require('url')

// Carrega o .env sem depender do pacote dotenv
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8')
  for (const line of envFile.split('\n')) {
    const match = line.match(/^([^#=][^=]*)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (!process.env[key]) process.env[key] = value
    }
  }
} catch {}

const authHandler = require('./api/auth')
const clientsHandler = require('./api/clients')

function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', () => {
      try { resolve(JSON.parse(body)) } catch { resolve({}) }
    })
  })
}

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, 'http://localhost')
  req.query = Object.fromEntries(parsed.searchParams)
  req.body = await parseBody(req)

  if (parsed.pathname === '/api/auth') return authHandler(req, res)
  if (parsed.pathname === '/api/clients') return clientsHandler(req, res)

  res.statusCode = 404
  res.end('Not found')
})

const PORT = 3001
server.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`))
