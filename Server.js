const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 7000;
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
//const res = require("express/lib/response");

// use middleware
app.use(cors());
app.use(express.json());

// mongodb connect



const uri = `mongodb+srv://${process.env.CAR_USER}:${process.env.CAR_PASSWORD}@cluster0.yoftv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('connected')
//   // perform actions on the collection object
//   client.close();
// });

async function run(){
   
    try {

    await client.connect();
    const carCollection = client.db('CarSelling').collection('cars');


       
        // Add all product
      app.get('/cars' , async (req, res) =>{
        const query = {};
        const cursor = carCollection.find(query);
        const carServices = await cursor.toArray();
        res.send(carServices);
     
      });

      //login JWT
    //   app.post('/login', async (req, res) => {
    //     const user = req.body;
    //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //         expiresIn: '1d'
    //     });
    //     res.send({ accessToken});
    // });
      // get id
      app.get('/cars/:id' ,async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const carIdService = await carCollection.findOne(query);
          res.send(carIdService);

      });
      //post
      // Add a new product
      app.post('/cars' , async(req,res, next) => {
        const newsCarAdd = req.body;
        const result = await carCollection.insertOne(newsCarAdd);
        res.send(result);
      });


      // update user put
 app.put("/cars/:carServiceId" , async(req ,res) => {
   const id = req.params.carServiceId;
   //console.log('empty', id);
   const count = req.body;
    const  filter = {_id:ObjectId(id)};
    const options = {upsert : true};
   console.log(count);
    const updateDoc = {
     $set :{
        quantity : count.newQuantity
      }
   };
      const result = await carCollection.updateOne(filter, updateDoc, options)
       res.send(result);

      //res.send({msg:'success'})
 });
    
     

      // delete user
      
      app.delete('/cars/:id' , async(req,res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const carDelete = await carCollection.deleteOne(query);
        res.send(carDelete);
      });


    }


    finally{

    };
};


run().catch(console.dir);





app.get("/", (reg, res) => {
  res.send("Running server node js");
});

app.listen(port, () => {
  console.log("CRUD server is running");
});
