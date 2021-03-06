const express = require('express');
const cors = require('cors');
const port =  4040;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hey, This is Amir Making Memories Server!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcwvo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("amirPhoto").collection("services");
  const orderCollection = client.db("amirPhoto").collection("orders");
  const adminCollection = client.db("amirPhoto").collection("admin");
  // perform actions on the collection object
  

  // adding Services
  app.post('/addService', (req, res) => {
      const service = req.body;
      serviceCollection.insertOne(service)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

// Getting Services
 app.get('/services', (req, res) => {
     serviceCollection.find()
     .toArray((err, documents) => {
         res.send(documents)
         console.log(err)
     })
 })


// getting Services By Id
app.get('/services/:id', (req, res) => {
    // const id = ObjectId(req.params._id)
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
        res.send(documents[0])
        console.log(err)
    })
})


// Delete Service
app.delete('/delete/:id', (req, res) => {
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
})








// adding Order 
app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
    })
})

// getting order list
app.get('/orderList', (req, res) => {
    orderCollection.find()
    .toArray((err, documents) => {
        res.send(documents)
        console.log(err)
    })
})


// Order via Email
app.get('/orderViaEmail', (req, res) => {
    orderCollection.find({customerEmail: req.query.email})
    .toArray((err, documents) => {
        res.status(200).send(documents)
        console.log(documents)
        console.log(err)
    })
})

// adding Admin
app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

// admin rule 
app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray((err, admin) => {
        res.send(admin.length > 0)
        console.log(err)
    })
})



app.get('/admin', (req, res) => {
    adminCollection.find()
    .toArray((err, documents) => {
        res.send(documents)
        console.log(err)
    })
})




  console.log('Database Connected')
});



app.listen(process.env.PORT || port);