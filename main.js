const express = require("express");
const bodyParser = require("body-parser");
const mustacheExpress = require("mustache-express");
const path = require("path");
const session = require("express-session");
const app = express();
const validator = require("express-validator");
const fs = require("fs");
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");


let incorrectGuesses = [];
let correctGuesses = [];
let currentWord = words[Math.floor(Math.random() * words.length)];




app.use(express.static(path.join(__dirname, "public")));

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

app.use(session({
  secret: 'asdfasdf',
  resave: false,
  saveUninitialized: true
}));
   
  
app.get("/", function(req,res){
	let remainingGuesses = (8-incorrectGuesses.length);
	res.render("index", {currentWord:currentWord, incorrectGuesses:incorrectGuesses, remainingGuesses:remainingGuesses});
});

app.post("/", function(req,res){

	if(currentWord.indexOf(req.body.selectedLetter) == -1){
		incorrectGuesses.push(req.body.selectedLetter);
		// console.log(incorrectGuesses)
	}
	correctGuesses.push(getMatches(currentWord, req.body.selectedLetter))
	console.log(correctGuesses);
  
	res.redirect("/");
});

app.listen(8080, function() {
  console.log("App is running on localhost:8080");
});

function getMatches(wordToSearch, letter){
	let wordAsArray = wordToSearch.split("");
	let matchingIndexArray = [];
	for(let i = 0; i < wordAsArray.length; i++){
		if(wordAsArray[i] == letter){
			matchingIndexArray.push(i)
		}
	}return matchingIndexArray;
}





