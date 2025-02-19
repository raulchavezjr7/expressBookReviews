const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validuser = users.filter((user)=>{
    return (user.username === username && user.password === password);
  })
  if(validuser.length > 0){
    return true;
  }
  else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"Error loggin in"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      date: password
    }, 'access',{expiresIn: 60*60})

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send("user Successfully logged in")
  } else{
    return res.status(208).json({messsage:"Invalid login. Try again"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  let book = books[isbn];

  if(book){
    let review = req.body.review;
    if(review){
      book.reviews[req.session.authorization.username] = review
      books[isbn] = book;
      res.send("Book review has been updated")
    }else{
      res.send("unable to find isbn")
    }
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if(book){
      delete books[isbn].reviews[req.session.authorization.username]
      res.send("Book review has been deleted")
  }else{
    res.send("unable to find review")
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
