require('dotenv').config()

const express = require('express');
const { check } = require('express-validator')
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

const Auth = require('./controllers/auth');
const cors = require('cors');

const { MONGO_DB_KEY } = process.env;
const MongoURI = `mongodb://example:${MONGO_DB_KEY}@127.0.0.1/tutoring?retryWrites=true&w=majority`
//                                  ^Insert password here     ^Insert db name here

mongoose.connect(MongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(res => console.log('Database Connected'));

const store = new MongoDBSession({
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

const whitelist = ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://127.0.0.1:5000', 'http://localhost:5000']
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./features/jwt")(passport);

app.get('/', (req, res) => {
  res.send("Welcome to my backend demonstration!")
})

app.post('/register', [

  check('email', 'Email is invalid').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters and less than 20').isLength({ min: 6, max: 20 }),

], Auth.register)

app.post('/login', Auth.login)

app.listen(PORT, console.log(`Server running on ${PORT}`))
