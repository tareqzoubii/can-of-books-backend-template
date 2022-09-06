'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
// app.use(cors());
app.use(cors({ origin: '*' }));
require('dotenv').config();

const mongoose = require('mongoose') // step 0 (import the mongoose!)

app.use(express.json()); // access the req.body!!

const BookModel = require('./Books.js')

const PORT = process.env.PORT || 3888;

// mongoose config step 1 connect mongose with DataBase!
mongoose.connect('mongodb://tareq13:0000@ac-zforxfs-shard-00-00.3kuo6qm.mongodb.net:27017,ac-zforxfs-shard-00-01.3kuo6qm.mongodb.net:27017,ac-zforxfs-shard-00-02.3kuo6qm.mongodb.net:27017/?ssl=true&replicaSet=atlas-gzn9oq-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb://localhost:27017/booksApp', {useNewUrlParser: true, useUnifiedTopology: true});
// mongodb+srv://tareq13:<password>@cluster0.3kuo6qm.mongodb.net/?retryWrites=true&w=majority 
// mongodb://tareq13:<password>@ac-zforxfs-shard-00-00.3kuo6qm.mongodb.net:27017,ac-zforxfs-shard-00-01.3kuo6qm.mongodb.net:27017,ac-zforxfs-shard-00-02.3kuo6qm.mongodb.net:27017/?ssl=true&replicaSet=atlas-gzn9oq-shard-0&authSource=admin&retryWrites=true&w=majority
//Routes Section 
app.get('/', homeHandler);
app.get('/getBooks', booksHandler);
app.post('/addNewBook', addNewBookHandler);
app.delete('/deleteBooks/:id', deleteBooksHandler);
app.get('/test', (request, response) => {

  response.send('test request received')

})

//Function Section
// http:localhost:3888/
function homeHandler(req, res) {
    res.send("This is the Home Route")
    //console.log("HELLO!, This is the Home Route")
}

// http:localhost:3888/getBooks
function booksHandler(req, res){
    BookModel.find({}, (err, result) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            //console.log(result);
            res.send(result);
        }
    })
}

// http:localhost:3888/addNewBook
async function addNewBookHandler(req, res){
    //console.log(req.body)
    const {title, description,status} = req.body;
    await BookModel.create({
        title: title,
        description: description,
        status: status
    })
    BookModel.find({}, (err, result) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            //console.log(result);
            res.send(result);
        }
    })
}
// http://localhost:3888/deleteBooks:id
function deleteBooksHandler(req, res){
  const bookID = req.params.id;
  console.log(bookID);
  BookModel.deleteOne({_id:bookID},(err, result) => {
      //console.log(result);
      BookModel.find({}, (err, result) => {
          if(err)
          {
              console.log(err);
          }
          else
          {
              //console.log(result);
              res.send(result);
          }
      })
  })
}
app.listen(PORT, () => {
  console.log(`Hello, this is PORT --> ${PORT}`);
})