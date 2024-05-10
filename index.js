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


    app.post('/foods', async (req, res) => {
      const foodData=req.body
      const result = await foodsCollection.insertOne(foodData)
      res.send(result)
    })

    app.get('/foods', async (req, res) => {

      const result = await foodsCollection.find().toArray()
      res.send(result)
    })

    app.get('/single-food/:id', async (req, res) => {
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result = await foodsCollection.findOne(query)
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