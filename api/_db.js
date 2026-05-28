const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI
let cachedClient = null

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(uri)
    await cachedClient.connect()
  }
  return cachedClient.db('al-crm')
}

module.exports = { getDb }
