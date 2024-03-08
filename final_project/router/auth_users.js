const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Assuming session contains the username
    
    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }
    
    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(400).json({ message: "You have not reviewed this book." });
    }

    // Delete the review associated with the session's username
    delete books[isbn].reviews[username];

    res.status(200).json({ 
        message: "Review deleted successfully.",
        book:  books[isbn]
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let sessionUsername = req.session.authorization.username
  let review = {
    "username": sessionUsername,
    "review": req.query.review
  };
  let resMessage;

  if (!books[isbn]) {
    return res.status(404).json({message: "book not found"});
  }

   // Check if the book already has reviews
   if (!books[isbn].reviews) {
    books[isbn].reviews = {};
   }

   // Check if the user has already reviewed this book
   if (books[isbn].reviews[sessionUsername]) {
    resMessage = {
        message: `Modifying existing review for user ${sessionUsername} on book ${isbn}: ${books[isbn].title}`,
        book: books[isbn]
    };
   } else {
    resMessage = {
        message: `Adding new review for user ${sessionUsername} on book ${isbn}: ${books[isbn].title}`,
        book: books[isbn]
    };
   }

   // Add or modify the review
   books[isbn].reviews[sessionUsername] = review;

  return res.status(300).json(resMessage);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
