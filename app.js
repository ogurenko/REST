// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// GET Route to fetch all the data from database
// Request targetting all the articles
app.route("/articles")

.get(function(req, res) {
Article.find(function(err, results) {
  if(!err) {
    res.send(results);
  } else {
    res.send(err);
  }
});
})

.post(function(req, res) {
  const dataPost = new Article({
    title: req.body.title,
    content: req.body.content
  });
  dataPost.save(function(err) {
    if (!err) {
      res.send("Everything is OK");
    } else {res.send("error");
  }
  });
})

.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if(!err) {
      res.send("Everything is OK");
    } else {
      res.send(err);
    }
  });
});


// Request targetting a specific item
// When route is repeated, put in to comprehensive route
// Dinamic Route
app.route("/articles/:articleTitle")
.get(function(req, res) {
  const specific = req.params.articleTitle;
  Article.findOne({title: specific}, function(err, result) {
    if(result) {
      res.send(result);
    } else {
      res.send("Article with that name has not found");
    }
  });
})

// Update all object in database
.put(function(req, res) {
  Article.update({title:req.params.articleTitle}, {title: req.body.title, content: req.body.content}, {overwrite:true}, function(err, result2) {
    if(result2) {
      res.send(result2);
    } else {
      res.send("Something is wrong");
    }
  });
})

// Update an part of object
.patch(function(req, res) {
  Article.update({title: req.params.articleTitle}, {$set: {content: req.body.content}}, function(err, result3) {
    if (result3) {
      res.send(result3);
    } else {
      res.send("Something is going wrong");
    }
  });
})

.delete(function(req, res) {
  Article.deleteOne({ title: req.params.articleTitle}, function(err, result4) {
    if(result4) {
      res.send("Succesfully deleted articles");
    } else { res.send("Something is going wrong");
  }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
