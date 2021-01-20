require('dotenv').config()

const express = require('express');
const session = require('express-session');
const MongoDBSesssion = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const UserModel = require('./models/User');

const DB_KEY = process.env.MONGO_DB_KEY;

const MongoURI = `mongodb+srv://-----:${process.env.MONGO_DB_KEY}@cluster-.-----.mongodb.net/workTimer?retryWrites=true&w=majority`
//                                    ^Insert password here                                  ^Insert db name here

mongoose.connect(MongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(res => console.log('Database Connected'));

const store = new MongoDBSesssion({
  uri: MongoURI,
  collection: 'sessions',
})

const app = express();
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("hello")
})

app.get('/logout', (req, res) => {

})

app.listen(PORT, console.log(`Server running on ${PORT}`))