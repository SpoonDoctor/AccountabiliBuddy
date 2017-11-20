"use strict";
/*Setup the server to display the application*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const path = require("path");
var fs = require("fs");
// var router = express.Router();

/*Use json to parse the body*/
app.use(bodyParser.urlencoded(
{
  extended: true
}));
app.use(bodyParser.text());
app.use(express.static("./htmlFiles"));

/*Start listening on server*/
app.listen(3000, "0.0.0.0", function()
{
  console.log("Example app listening on port 3000!");
});

app.get("/", function(req, res)
{
  res.render("index.html");
});
app.post("/progressSave", function(req, res)
{

  console.log(req.body);
  fs.writeFileSync("./savedData/progressSave.json", req.body, "utf8");
  res.sendStatus(200);
});
app.post("/goalsSave", function(req, res)
{

  console.log(req.body);
  fs.writeFileSync("./savedData/goalsSave.json", req.body, "utf8");
  res.sendStatus(200);
});

app.get("/setValsProg", function(req, res)
{
  fs.readFile("./savedData/progressSave.json", "utf8", function(err, data)
  {
    if (err)
    {
      res.sendStatus(500);
    }
    else
    {
      res.send(data);

    }
  });

});

app.get("/setValsGoals", function(req, res)
{

  fs.readFile("./savedData/goalsSave.json", "utf8", function(err, data)
  {
    if (err)
    {
      res.sendStatus(500);
    }
    else
    {
      res.send(data);
    }
  });

});