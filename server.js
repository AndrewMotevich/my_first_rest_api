/** @format */

const {MongoClient} = require('mongodb');
// const uri = 'mongodb://localhost:27017';
// const cloudURI = 'mongodb+srv://andrewmotevich:a9gwZbPpNbuICb29@cluster0.b23op1h.mongodb.net/?retryWrites=true&w=majority'
const cloudURI = 'mongodb+srv://vercel-admin-user:MCm8xsb6HBmZkcGP@cluster0.b23op1h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new MongoClient(cloudURI);

var express = require("express");
var app = express();

app.use(express.json());

app.get("/listUsers", async function (req, res) {
  const usersArray = await client.db('myDatabase').collection('users').find().toArray();
  res.end(JSON.stringify(usersArray));
});

app.post("/addUser", async function (req, res) {
  // First read existing users.
  const reqData = req.body;
  if (Object.keys(reqData).length === 4 && Object.keys(reqData).includes('userName') && Object.keys(reqData).includes('userPassword') && Object.keys(reqData).includes('email') && Object.keys(reqData).includes('phone')){
    const newUser = await client.db('myDatabase').collection('users').insertOne(reqData);
    const checkUser = await client.db('myDatabase').collection('users').findOne({"userName": `${reqData.userName}`})
    res.end(JSON.stringify(checkUser));
  }
  else {
    res.status(500)
    res.end('Some Error')
  }
});

app.get("/:name", async function (req, res) {
  // First read existing users.
  try {
    const user = await client.db('myDatabase').collection('users').findOne({"userName": `${req.params.name}`});
    if (user === null){
      res.status(404);
      res.end("This user do not exist")
    }
    else{
      res.end(JSON.stringify(user))
    }
  }
  catch (err) {
    res.status(500)
    res.end(err);
  }
});

app.delete('/deleteUser/:name', async function (req, res) {
  // First read existing users.
  try {
    const user = await client.db('myDatabase').collection('users').findOne({"userName": `${req.params.name}`});
    if (user === null){
      res.status(404);
      res.end("This user do not exist")
    }
    else{
      await client.db('myDatabase').collection('users').deleteOne({"userName": `${req.params.name}`});
      res.end("This user deleted")
    }
  }
  catch (err) {
    res.status(500)
    res.end(err);
  }
})

app.patch('/updateUser/:name', async function (req, res){
  const reqData = req.body;
  try {
    const user = await client.db('myDatabase').collection('users').findOne({"userName": `${req.params.name}`});
    if (user === null){
      res.status(404);
      res.end("This user do not exist")
    }
    else{
      await client.db('myDatabase').collection('users').updateOne({"userName": `${req.params.name}`}, { $set: reqData});
      res.end(JSON.stringify(reqData))
    }
  }
  catch (err) {
    res.status(500)
    res.end(err);
  }
})

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
