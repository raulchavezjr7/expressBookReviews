const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){

    let userwithsamename = users.filter((user)=>{
      return user.username === username;
    });

    if(userwithsamename > 0){
      return res.status(404).json({message:"User already exists!"});
    }
    else{
      users.push({
        "username" : username,
        "password" : password,
      })
      return res.status(200).json({message:"User successfully registered"});
    }
  }
  return res.status(404).json({message: "Unable to register user"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,4));
//   //return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/', async (req,res) => {
  new Promise ((resolve, reject)=>{
    if(books){
      resolve(books)
    }
    else{
      reject("Book could not be retrieve, try again")
    }
  }).then((books)=>{
    res.send(JSON.stringify(books,null,4));
  }).catch((error)=>{
    res.status(404).json({message: error});
  })
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   let book = books[isbn];

//   if(book){
//     res.send(books[isbn])
//   }
//   else{
//     res.send("ISBN does not exsit");
//   }
//   //return res.status(300).json({message: "Yet to be implemented"});
//  });
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   let filtered_books = Object.values(books).filter((book) => book.author === author);
//   res.send(filtered_books);
//   //return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve,reject) =>{
  const book = books[isbn];
  if(book){
    resolve(book)
  }
  else{
    reject("ISBN does not exsit")
  }
  }).then((resolve)=>{
  res.send(resolve)
  }).catch((error)=>{
  res.status(303).json({message: error});
  })
});

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   let filtered_books = Object.values(books).filter((book) => book.title === title);
//   res.send(filtered_books);
//   //return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
 
  new Promise((resolve,reject) =>{
    let filtered_books = Object.values(books).filter((book) => book.author === author);
    if(filtered_books.length > 0){
      resolve(filtered_books)
    }
    else{
      reject("Book author not found");
    }
  }).then((resolve)=>{
    res.send(resolve)
  }).catch((error)=>{
    res.status(303).json({message: error});
  })
 });

 
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
 
  new Promise((resolve,reject) =>{
    let filtered_books = Object.values(books).filter((book) => book.title === title);
    if(filtered_books.length > 0){
      resolve(filtered_books)
    }
    else{
      reject("Book title not found");
    }
  }).then((resolve)=>{
    res.send(resolve)
  }).catch((error)=>{
    res.status(303).json({message: error});
  })
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];

  if(book){
    res.send(books[isbn].reviews)
  }
  else{
    res.send("ISBN does not exsit");
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
