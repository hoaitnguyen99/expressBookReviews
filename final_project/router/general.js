const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register userm, username and password not found."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Creating a promise to handle asynchronous operation
    const getBooksPromise = new Promise((resolve, reject) => {
        // Simulating an asynchronous operation, for example, fetching books from a database
        setTimeout(() => {
            // Resolve the promise with the list of books
            resolve(books);
        }, 1000); // Simulating delay of 1 second
    });

    // Handling promise using .then() and .catch()
    getBooksPromise.then((books) => {
        // Sending the list of books as JSON response
        res.status(200).json(books);
    }).catch((error) => {
        // Handling errors
        res.status(500).json({ error: "Internal Server Error" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    
    // Creating a promise to handle asynchronous operation
    const getBookDetailsPromise = new Promise((resolve, reject) => {
        // Simulating an asynchronous operation, for example, fetching book details from a database
        setTimeout(() => {
            // Checking if the book exists
            if (books[isbn]) {
                // Resolve the promise with the book details
                resolve(books[isbn]);
            } else {
                // Reject the promise with an error if the book does not exist
                reject("Book not found");
            }
        }, 1000); // Simulating delay of 1 second
    });

    // Handling promise using .then() and .catch()
    getBookDetailsPromise.then((book) => {
        // Sending the book details as JSON response
        res.status(200).json(book);
    }).catch((error) => {
        // Handling errors
        res.status(404).json({ error: "Book not found" });
    });
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;

    const getBooksByAuthorPromise = new Promise((resolve, reject) => {
        // Simulating an asynchronous operation, for example, filtering books by author
        setTimeout(() => {
            // Filtering books by the specified author
            const authorBooks = Object.values(books).filter(book => book.author === author);

            // Resolve the promise with the books by the author
            if (authorBooks.length > 0) {
                resolve(authorBooks);
            } else {
                reject("Books by author not found");
            }
        }, 1000); // Simulating delay of 1 second
    });

    // Handling promise using .then() and .catch()
    getBooksByAuthorPromise.then((authorBooks) => {
        // Sending the books by the author as JSON response
        res.status(200).json(authorBooks);
    }).catch((error) => {
        // Handling errors
        res.status(404).json({ error: "Books by author not found" });
    });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {const title = req.params.title;

    // Creating a promise to handle asynchronous operation
    const getBooksByTitlePromise = new Promise((resolve, reject) => {
        // Simulating an asynchronous operation, for example, searching books by title
        setTimeout(() => {
            // Iterating over books to find books with the specified title
            const titleBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

            // Resolve the promise with the books matching the title
            if (titleBooks.length > 0) {
                resolve(titleBooks);
            } else {
                reject("Books by title not found");
            }
        }, 1000); // Simulating delay of 1 second
    });

    // Handling promise using .then() and .catch()
    getBooksByTitlePromise.then((titleBooks) => {
        // Sending the books matching the title as JSON response
        res.status(200).json(titleBooks);
    }).catch((error) => {
        // Handling errors
        res.status(404).json({ error: "Books by title not found" });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  booksISBN = req.params.isbn;
  let bookReview = Object.keys(books[booksISBN].reviews).length === 0 ? {message: `This book has no reviews`} : books[booksISBN].reviews
  return res.status(300).json(bookReview);
});

module.exports.general = public_users;
