require('dotenv').config()

const express = require('express');
const { check } = require('express-validator')
const session = require('express-session');
const MongoDBSesssion = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const User = require('./models/User');

const MongoURI = `mongodb://example:${process.env.MONGO_DB_KEY}@127.0.0.1/tutoring?retryWrites=true&w=majority`
//                                  ^Insert password here       ^URL here ^Insert db name here

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("Welcome to my backend demonstration!")
})

app.get('/logout', (req, res) => {

})

app.post('/register', [
  check('email', 'Email is invalid').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters and less than 20').isLength({ min: 6, max: 20 }),
], async (req, res) => {
  try {
    const { email } = req.body;

    // Make sure this account doesn't already exist
    const user = await User.findOne({ email });

    if (user) return res.status(401).json({ message: 'The email address you have entered is already associated with another account.' });

    const newUser = new User({ ...req.body });
    const user_ = await newUser.save();

    res.send(user_)
} catch (error) {
    console.log(error)
    res.status(500).json({success: false, message: error.message})
}
})

app.listen(PORT, console.log(`Server running on ${PORT}`))