const User = require('../models/User');
const jwt = require('jsonwebtoken');

//register a new user
const registerUser = async (req, res)=>{
    const {name, email, password} = req.body;
    try{
        const user = await User.create({name,email,password});
        res.status(201).json({message:'user registered successfully',user});

    }catch(error) {
        res.status(400).json({message: error.message});
    }
};

//login user
const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

module.exports = { registerUser, loginUser };