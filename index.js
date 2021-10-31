const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f9slz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("soloTravellers");
    const bookingCollection = database.collection("booking");
    const orderCollection = database.collection("bookingOrder");

    // GET API (Send limited booking data)
    app.get("/booking-home", async (req, res) => {
      const cursor = bookingCollection.find({}).limit(6);
      const result = await cursor.toArray();

      res.json(result);
    });
    // GET API (Send all booking data)
    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();

      res.json(result);
    });
    // GET API (Send a booking data)
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const result = await bookingCollection.findOne(query);

      res.json(result);
    });
    // ADD API (Add a booking)
    app.post("/booking", async (req, res) => {
      const doc = req.body;
      const result = await bookingCollection.insertOne(doc);
      console.log("Booking Add");
      res.json(result);
    });
    // PUT API (Update a booking)
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const updateDoc = {
        $set: req.body,
      };
      const options = { upsert: true };
      const result = await bookingCollection.updateOne(
        query,
        updateDoc,
        options
      );
      console.log("Edit Booking");
      res.json(result);
    });

    // POST API (Add a order)
    app.post("/order", async (req, res) => {
      const doc = req.body;
      const result = await orderCollection.insertOne(doc);
      console.log("Order Add");
      res.json(result);
    });

    // GET ALL (Send all order data)
    app.get("/order", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      // const reverseArry = await {
      //   $reverseArray: {
      //     $literal: result,
      //   },
      // };
      res.json(result);
    });
    // GET API (Search by email send all matching data)
    app.get("/order/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const cursor = await orderCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // DELETE API (Delete a order data)
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    // DELETE API (Delete all order by email)
    app.delete("/allorder/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        userEmail: email,
      };
      const result = await orderCollection.deleteMany(query);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
