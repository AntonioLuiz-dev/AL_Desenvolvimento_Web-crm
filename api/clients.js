const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')
const { getDb } = require('./_db')

function verifyToken(req) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return null
  try {
    return jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET)
  } catch {
    return null
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const user = verifyToken(req)
  if (!user) return res.status(401).json({ error: 'Não autorizado.' })

  try {
    const db = await getDb()
    const col = db.collection('clients')

    // Listar todos
    if (req.method === 'GET') {
      const clients = await col.find({}).sort({ createdAt: -1 }).toArray()
      return res.json(clients.map(c => ({ ...c, id: c._id.toString(), _id: undefined })))
    }

    // Criar novo
    if (req.method === 'POST') {
      const { id, _id, ...data } = req.body
      const doc = { ...data, createdAt: new Date().toISOString().split('T')[0] }
      const result = await col.insertOne(doc)
      return res.status(201).json({ ...doc, id: result.insertedId.toString() })
    }

    // Atualizar
    if (req.method === 'PUT') {
      const { id, _id, ...data } = req.body
      if (!id) return res.status(400).json({ error: 'ID obrigatório.' })
      await col.updateOne({ _id: new ObjectId(id) }, { $set: data })
      return res.json({ ok: true })
    }

    // Deletar
    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'ID obrigatório.' })
      await col.deleteOne({ _id: new ObjectId(id) })
      return res.json({ ok: true })
    }

    res.status(405).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}
