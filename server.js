/** @format */

const e = require("express");
var express = require("express");
var app = express();
var fs = require("fs");

app.use(express.json());

app.get("/listUsers", function (req, res) {
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    res.end(data);
  });
});

app.post("/addUser", function (req, res) {
  // First read existing users.
  const reqData = req.body;
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    try {
      const newData = JSON.parse(data);
      const newId = newData[`${newData.length - 1}`].id + 1;
      newData.forEach((elem) => {
        if (elem.email === reqData.email) {
          res.end('THIS EMAIL EXIST');
          throw new Error('Error: this email exist')
        }
      });
      reqData.id = newId;
      newData.push(reqData);
      fs.writeFile(
        __dirname + "/" + "users.json",
        JSON.stringify(newData),
        {},
        (err) => {}
      );
      res.end(JSON.stringify(newData));
    } catch (err) {}
  });
});

app.get("/:id", function (req, res) {
  // First read existing users.
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    const users = JSON.parse(data);
    let user = {};
    users.forEach((elem) => {
      if ((elem.id = req.params.id)) {
        user = elem;
      }
    });
    res.end(JSON.stringify(user));
  });
});

app.delete('/deleteUser/:id', function (req, res) {
  // First read existing users.
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     let newData = JSON.parse( data );
     newData.forEach((elem, index) => {
       if (elem.id == req.params.id){
         console.log(elem.id);
         console.log(req.params.id);
         newData.splice(index, 1);
        fs.writeFile(
          __dirname + "/" + "users.json",
          JSON.stringify(newData),
          {},
          (err) => {}
        );
      }
     })
     res.end( JSON.stringify(newData));
  });
})

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
