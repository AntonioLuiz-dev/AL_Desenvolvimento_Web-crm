const jwt = require('jsonwebtoken')

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
  }

  const validEmail = email.trim().toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
  const validPassword = password === process.env.ADMIN_PASSWORD

  if (!validEmail || !validPassword) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' })
  return res.json({ token })
}
