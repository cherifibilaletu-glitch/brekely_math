import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient, ObjectId } from "mongodb"

dotenv.config()

const { MONGODB_URI, PORT = 4000, CORS_ORIGIN = "*" } = process.env

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Copy .env.example to .env and fill it in.")
  process.exit(1)
}

const app = express()
app.use(cors({ origin: CORS_ORIGIN }))
app.use(express.json({ limit: "2mb" }))

const client = new MongoClient(MONGODB_URI)
let attemptsCol

async function start() {
  await client.connect()
  const db = client.db("brekely_math")
  attemptsCol = db.collection("attempts")
  await attemptsCol.createIndex({ createdAt: -1 })
  app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`))
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "brekely_math", time: new Date().toISOString() })
})

app.get("/api/attempts", async (_req, res) => {
  try {
    const items = await attemptsCol.find().sort({ createdAt: -1 }).toArray()
    res.json(items)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

app.post("/api/attempts", async (req, res) => {
  try {
    const doc = { ...req.body, createdAt: req.body.createdAt || Date.now() }
    delete doc._id
    const result = await attemptsCol.insertOne(doc)
    res.status(201).json({ ...doc, _id: result.insertedId })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

app.put("/api/attempts/:id", async (req, res) => {
  try {
    const update = { ...req.body }
    delete update._id
    await attemptsCol.updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

app.delete("/api/attempts/:id", async (req, res) => {
  try {
    await attemptsCol.deleteOne({ _id: new ObjectId(req.params.id) })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

start().catch((e) => {
  console.error("Failed to start server:", e)
  process.exit(1)
})
