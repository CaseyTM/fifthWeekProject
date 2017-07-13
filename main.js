const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const mustacheExpress = require("mustache-express");
const path = require("path");
const session = require("express-session");
const fs = require("file-system");
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.use(express.static(path.join(__dirname, "public")));

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({extended: true}));


app.use(session({
  secret: 'wat',
  resave: false,
  saveUninitialized: false
}));

let word = words[Math.floor(Math.random()*words.length)];
let letters = word.split("");
let underscores = [];
let correctLetters = [];
let lettersGuessed = [];
let guessesLeft = 8;
let incorrectGuesses = [];

letters.forEach(function(newUnderscore){
  underscores.push("_");
});

app.get("/", function(req, res){
  let gameData = {
    underscore:underscores,
    allLetters:lettersGuessed,
    guesses:guessesLeft
  }
  res.render("index", gameData);

});
app.get("/gameover", function(req, res){
  res.render("gameover", {words: word});
});

app.get("/winner", function(req, res){
  res.render("win");
});

app.post("/", function(req, res){
  let match = false;
  messages = [];
  req.checkBody("selectedLetter", "Don't need validation for a select !").notEmpty();
  req.checkBody("selectedLetter", "Validations are fun").isLength({max: 1});
  req.checkBody("selectedLetter", "Helooooo nurse!").isAlpha();

  let errors = req.validationErrors();
  if (errors) {
    errors.forEach(function(error) {
      messages.push(error.msg);
      match = true;
    });
  }
  for (var i = 0; i < letters.length; i++) {
    letter = letters[i]

    if (letter === req.body.selectedLetter) {
      correctLetters.push(letter);
      underscores[i] = letters[i];
      match = true;

    }
  }
  for (var i = 0; i < lettersGuessed.length; i++) {
    guessedLetter = lettersGuessed[i];
    if(guessedLetter === req.body.selectedLetter){
      messages.push("Try Again, You've Already Guessed That");
      match = true;
    }
  }
  if (match === false) {
    guessesLeft -= 1;
  }
  if(req.body.selectedLetter){
    lettersGuessed.push(req.body.selectedLetter)
  }
  if (guessesLeft === 0) {
    res.redirect("/gameover");
  }
    let underscore = underscores[i];
    if (underscores.indexOf("_") < 0) {
      res.redirect("/winner");
    } else {
    res.redirect("/")
    }

});

app.post("/gameover", function(req, res){
  req.session.destroy();
  word = words[Math.floor(Math.random()*words.length)];
  letters = word.split("");
  underscores = [];
  letters.forEach(function(newUnderscore){
    underscores.push("_");
  });
  lettersGuessed = [];
  guessesLeft = 8;
  res.redirect("/");

});

app.post("/winner", function(req, res){
  req.session.destroy();
  word = words[Math.floor(Math.random()*words.length)];
  letters = word.split("");
  underscores = [];
  letters.forEach(function(newUnderscore){
    underscores.push("_");
  });
  lettersGuessed = [];
  guessesLeft = 8;
  res.redirect("/");
});

app.listen(8000, function(){
  console.log("your app is running on localhost:3000");
});
