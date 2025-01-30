const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role, // Include role in the payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password }); // Debug statement

  try {
    let user = await User.findOne({ username });
    if (!user) {
      console.log('User not found'); // Debug statement
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('User found:', user); // Debug statement

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch); // Debug statement

    if (!isMatch) {
      console.log('Password does not match'); // Debug statement
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('Password matches'); // Debug statement

    const payload = {
      user: {
        id: user.id,
        role: user.role, // Include role in the payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyToken = async (req, res) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    res.json({ msg: 'Token is valid', user: req.user });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.logout = (req, res) => {
  res.json({ msg: 'User logged out' });
};