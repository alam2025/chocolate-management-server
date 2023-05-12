const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

// mildeware
app.use(cors());
app.use(express.json());


// mongo added  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfkbd0s.mongodb.net/?retryWrites=true&w=majority`;

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
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();

            const chocolateCollection = client.db("chocolateDB").collection("add_chocolate");
            //insert new chocolate
            app.post('/chocolate',async(req,res)=>{
                  const chocolate = req.body;
                  const result= await chocolateCollection.insertOne(chocolate);
                  res.send(result);
            })
            

            app.get('/chocolates',async(req,res)=>{
                  const cursor = await chocolateCollection.find();
                  const result = await cursor.toArray()
                  res.send(result)
            })

            app.get('/chocolate/:id',async(req,res)=>{
                  const id = req.params.id;
                  const query = {_id: new ObjectId(id)};
                  const result= await chocolateCollection.findOne(query);
                  res.send(result)
            })

            app.delete('/chocolate/:id',async(req,res)=>{
                  const id= req.params.id;
                  const query={_id:new ObjectId(id)};
                  const result = await chocolateCollection.deleteOne(query);
                  res.send(result)
            })

            app.put('/chocolate/:id',async(req,res)=>{
                  const id = req.params.id;
                  const filter= {_id:new ObjectId(id)};
                  const options={upsert:true};
                  const updateChocolate= req.body;
                  // console.log(updateChocolate,id);

                  const chocolate ={
                        $set:{
                              name:updateChocolate.name,
                              photoUrl:updateChocolate.photoUrl,
                              country:updateChocolate.country,
                              category:updateChocolate.category
                        }
                  }
                  const result = await chocolateCollection.updateOne(filter,chocolate,options);
                  res.send(result)

                  // console.log(chocolate);

            })



            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
            // Ensures that the client will close when you finish/error
            // await client.close();
      }
}
run().catch(console.dir);

// mongo added 

// api's 
app.get('/', (req, res) => {
      res.send('WELCOME TO CHOCOLATE MANAGEMENT SERVER...')
})

app.listen(port, () => {
      console.log(`Chocolate server is running on : ${port}`);
})