
import bcrypt from 'bcryptjs';
import express from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../model/adminSchema.js';
import User from '../model/UserSchema.js';
import Order from '../model/orderSchema.js';
import Fooditem from '../model/ShopSchema.js';
const router=express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        admin = new Admin({ 
            name, 
            email, 
            password: hashedPassword,
        });
        await admin.save();

        const payload = { admin: { id: admin.id } };
        const token = jwt.sign(payload, 'admintoken', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password,admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { admin: { id: admin.id ,name: admin.name, email: admin.email} };
        const token = jwt.sign(payload, 'admintoken', { expiresIn: '1h' });

        res.json({
            token,
            admin:{
                id:admin.id,
                name:admin.name,
                email:admin.email,
            }
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/alluser', async (req,res)=>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.get('/alladmin', async (req,res)=>{
    try {
        const users = await Admin.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.get('/allorder', async (req,res)=>{
    try {
        const users = await Order.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.put('/update', async (req, res) => {
    const { adminId } = req.query;
    console.log(adminId)
    const { name, email } = req.body;
  
    try {

        const existingUser = await Admin.findOne({ email });

        if (existingUser && existingUser._id.toString() !== adminId) {
          return res.status(400).json({ error: 'Email already in use' });
        }
      const updatedAdmin = await Admin.findByIdAndUpdate(
        adminId,
        { name, email },
        { new: true } 
      );
  
      if (!updatedAdmin) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(updatedAdmin);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });


  router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
  });

  
  
  

export default router;