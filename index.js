const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());



const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


// name= abhamid3311
// pass= GNIceevnmjl5f43s

const run = async () => {
  try {
    const productsCollection = client.db('moon_Tech').collection('products');

    console.log("DB Connected")



    //products APIs
    app.get("/products", async (req, res) => {
      const data = await productsCollection.find({}).toArray();
      res.send(data);
    });


    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.post('/product', async (req, res) => {
      const title = req.body.title;
      const author = req.body.author;
      const genre = req.body.genre;
      const publicationDate = req.body.publicationDate;
      const reviews = [];
      const createdAt = new Date();
      const product = { title, author, genre, publicationDate, createdAt, reviews }

      const result = await productsCollection.insertOne(book);
      res.send(result);
    });

    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      console.log(book)

      const options = { upsert: true };
      const updateDoc = {
        $set: product,
      };

      const result = await productsCollection.updateOne({ _id: ObjectId(id) }, updateDoc, options);


      if (result.modifiedCount !== 1) {
        console.error('product not Updated');
        return res.status(404).json({ error: 'product not found' });
      }

      console.log('product Updated successfully');
      return res.status(200).json({ message: 'product Updated successfully', result });
    });



    //Comments
    app.post('/comment/:id', async (req, res) => {
      const productId = req.params.id;
      const comment = req.body;

      console.log(productId);
      console.log(comment);

      const result = await productsCollection.updateOne(
        { _id: ObjectId(productId) },
        { $push: { reviews: comment } }
      );

      console.log(result);

      if (result.modifiedCount !== 1) {
        console.error('Product not found or comment not added');
        res.status(404).json({ error: 'Product not found or comment not added' });
        return;
      }

      const updatedBook = await productsCollection.findOne({ _id: ObjectId(productId) });
      console.log('Comment added successfully');
      res.status(200).json({ message: 'Comment added successfully', updatedBook });


    });


    app.get('/comment/:id', async (req, res) => {
      const productId = req.params.id;

      try {
        const result = await productsCollection.findOne(
          { _id: ObjectId(productId) },
          { projection: { _id: 0, reviews: 1 } }
        );

        if (result) {
          res.json(result.reviews.reverse()); // Send the reviews array
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      } catch (error) {
        console.error('Error retrieving comments', error);
        res.status(500).json({ error: 'Server error' });
      }
    });




    //Users

    app.post('/user', async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;

      const result = await userCollection.findOne({ email });

      if (result?.email) {
        return res.send({ status: true, data: result });
      }

      res.send({ status: false });
    });



  } finally {
  }
};

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From MoonTech !');
});

app.listen(port, () => {
  console.log(`MoonTech listening on port ${port}`);
});
