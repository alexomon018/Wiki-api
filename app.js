const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("Article", articleSchema);

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Succesfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully delted all articles");
      } else {
        res.send(err);
      }
    });
  });
///////////////////////////////////////Requests to Target a Specific Article///////////////////////////////////////////
app
  .route("/articles/:name")
  .get((req, res) => {
    const name = req.params.name;
    Article.find({ title: name }, (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    const name = req.params.name;
    Article.updateOne(
      { title: name },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Succsesfully updated article.");
        }
      }
    );
  })
  .patch((req, res) => {
    const name = req.params.name;
    Article.updateOne(
      { title: name },
      {
        $set: req.body,
      },
      (err) => {
        if (!err) {
          res.send("Succsesfully patched article.");
        }else{
          res.send(err);
        }
      }
    );
  }).delete((req,res)=>{
    const name = req.params.name;
    Article.deleteOne(
      { title: name },

      (err) => {
        if (!err) {
          res.send("Succsesfully updated article.");
        }
      }
    );
  })
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
