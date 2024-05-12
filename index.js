const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

const port = process.env.PORT || 5000

const app = express()

app.use(cors({
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
}))

app.use(express.json())

const uri = `mongodb+srv://${process.env.KEY}:${process.env.KEY}@cluster0.rth5hqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    const foodsCollection = client.db('flavorFusion').collection('foods')
    const ordersCollection = client.db('flavorFusion').collection('orders')
    const galleryCollection = client.db('flavorFusion').collection('gallery')


    app.post('/orders', async (req, res) => {
      const orderData = req.body
      const result = await ordersCollection.insertOne(orderData)
      res.send(result)
    })

    app.patch('/foods/:id', async (req, res) => {
      const id = req.params.id
      const count = req.body.newCount
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {count}
      }
      const result = await foodsCollection.updateOne(query, updateDoc)
      res.send(result)


    })

    app.post('/foods', async (req, res) => {
      const foodData = req.body
      const result = await foodsCollection.insertOne(foodData)
      res.send(result)
    })
    app.post('/gallery', async (req, res) => {
      const galleryData = req.body
      const result = await galleryCollection.insertOne(galleryData)
      res.send(result)
    })

    app.get('/foods', async (req, res) => {

      const result = await foodsCollection.find().toArray()
      res.send(result)
    })
    app.get('/gallery', async (req, res) => {

      const result = await galleryCollection.find().toArray()
      res.send(result)
    })

    app.get('/foods/:email', async (req, res) => {
      const email = req.params.email
      const query = { 'added_by.email': email }
      const result = await foodsCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/orders/:email', async (req, res) => {
      const email = req.params.email
      const query = { 'customer.email': email }
      const result = await ordersCollection.find(query).toArray()
      res.send(result)
    })


    app.get('/single-food/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await foodsCollection.findOne(query)
      res.send(result)
    })

    app.put('/foods/:id', async (req, res) => {
      const id = req.params.id
      const foodData = req.body
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: { ...foodData }
      }
      const result = await foodsCollection.updateOne(query, updateDoc, options)
      res.send(result)

    })

    app.delete('/foods/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await foodsCollection.deleteOne(query)
      res.send(result)

    })
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await ordersCollection.deleteOne(query)
      res.send(result)

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port)