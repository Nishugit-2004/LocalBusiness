
import bcrypt from 'bcryptjs';
import User from '../model/UserSchema.js';
import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import Contact from '../model/ContactSchema.js';

const router=express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ 
            name, 
            email, 
            password: hashedPassword,
            phone 
        });
        await user.save();

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, 'manya', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const payload = { user: { id: user.id ,name: user.name, email: user.email,phone:user.phone} };
        const token = jwt.sign(payload, 'manya', { expiresIn: '1h' });

        res.json({
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                phone:user.phone
            }
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.put('/update', async (req, res) => {
    const { userId } = req.query;
    const { name, email, phone } = req.body;
  
    try {

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ error: 'Email already in use' });
        }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, phone },
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });

router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
     try {
      const user = await User.findOne({ email });
   
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const token = crypto.randomBytes(20).toString('hex');
      user.password= token;
      user.resetPasswordExpires = Date.now() + 3600000; 
      await user.save();
  
      
      const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'manyasahu94@gmail.com',
          pass: 'fqcp ifqv gjkr wivt',
        },
      });
      await transporter.sendMail({
        to: user.email,
        from:'manyasahu94@gmail.com',
        subject: 'Manyawar Restaurant',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process:\n\n
               https://food-project-food-i2jz.vercel.app/user/resetpassword/${token}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      }); 
      res.status(200).json({ message: 'Password reset email sent' });

    } catch (err) {
      console.error("server error",err)
      res.status(500).send({ message: 'Server error' });
    }
  });
  
  
  router.post('/resetpassword/:token', async (req, res) => {
    const { token}=req.params;
    const {password}=req.body;
    console.log(password)
    console.log(token)
    try {
      const user = await User.findOne({ password: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
      console.log(user)
      if (!user) {
        return res.status(400).send({ message: 'Password reset token is invalid or has expired' });
      }
  
      const newpassword = await bcrypt.hash(password, 10);
      user.password = newpassword;
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).send({ message: 'Password has been reset' });
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });
  

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
  
    try {
      const newContact = new Contact({ name, email, message });
      await newContact.save();
      res.status(201).json({ message: 'Contact data saved successfully' });
    } catch (err) {
      console.error('Error saving contact data:', err);
      res.status(500).json({ error: 'Failed to save contact data' });
    }
  });




  router.get('/contact', async (req,res)=>{
    try {
        const users = await Contact.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})




export default router;