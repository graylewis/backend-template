const User = require('../models/user');
const Token = require('../models/token');
const jwt = require('../features/jwt');

exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({message: 'The email address ' + email + ' is not associated with any account. Double-check your email address and try again.'});

      //validate password
      if (!user.comparePassword(password)) return res.status(401).json({message: 'Invalid email or password'});

      // Login successful, write token, and send back user
      res.status(200).json(user.generateJWT());
  } catch (error) {
      res.status(500).json({message: error.message})
  }
};

exports.register = async (req, res) => {
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
}