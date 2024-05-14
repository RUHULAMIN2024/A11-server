const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

const port = process.env.PORT || 5000

const app = express()

app.use(cors({
  origin: ['http://flavor-fusion-11.surge.sh'],
  credentials: true,
  optionsSuccessStatus: 200,
}))

app.use(express.json())
app.use(cookieParser())

const uri = `mongodb+srv://${process.env.KEY}:${process.env.KEY}@cluster0.rth5hqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }

  if (token) {
    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'unauthorized access' })
      }
      req.user = decoded
      next()
    })
  }
}

async function run() {
  try {

    const foodsCollection = client.db('flavorFusion').collection('foods')
    const ordersCollection = client.db('flavorFusion').collection('orders')
    const galleryCollection = client.db('flavorFusion').collection('gallery')

    // jwt token

    app.post('/jwt', (req, res) => {
      const user = req.body
      const token = jwt.sign(user, process.env.TOKEN, { expiresIn: '1d' })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true })
    })

    app.post('/logout', (req, res) => {
      const user = req.body
      res
        .clearCookie('token', { maxAge: 0 })
        .send({ success: true })
    })

    app.post('/orders', async (req, res) => {
      const orderData = req.body
      const result = await ordersCollection.insertOne(orderData)
      res.send(result)
    })

    app.patch('/foods/:id', verifyToken, async (req, res) => {
      const id = req.params.id
      const count = req.body.newCount
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: { count }
      }
      const result = await foodsCollection.updateOne(query, updateDoc)
      res.send(result)


    })

    app.post('/foods', async (req, res) => {
      const foodData = req.body
      const result = await foodsCollection.insertOne(foodData)
      res.send(result)
    })
    app.post('/gallery',  async (req, res) => {
      const galleryData = req.body
      const result = await galleryCollection.insertOne(galleryData)
      res.send(result)
    })

    app.get('/foods', async (req, res) => {
      const result = await foodsCollection.find().toArray()
      res.send(result)
    })
    app.get('/food-name/:value', async (req, res) => {
      const value = req.params.value
      
      const query = { food_name: value }

      const result = await foodsCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/gallery', async (req, res) => {

      const result = await galleryCollection.find().toArray()
      res.send(result)
    })

    app.get('/foods/:email', verifyToken, async (req, res) => {
      const tokenEmail = req.user.email
      const email = req.params.email
      if (tokenEmail !== email) {
        return res.status(403).send({ message: 'forbidden access' })
      }
      const query = { 'added_by.email': email }
      const result = await foodsCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/orders/:email', verifyToken, async (req, res) => {
      const tokenEmail = req.user.email
      console.log(tokenEmail)
      const email = req.params.email
      if (tokenEmail !== email) {
        return res.status(403).send({ message: 'forbidden access' })
      }
      const query = { 'customer.email': email }
      const result = await ordersCollection.find(query).toArray()
      res.send(result)
    })


    app.get('/single-food/:id', verifyToken, async (req, res) => {
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