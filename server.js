const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/miniAmazon1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schemas and Models
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    password: String
});

const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    category: String
});

const cartItemSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId, // Reference to the user's ID
    cname: String, // Field to store the logged-in user's name
    items: [{ 
        name: String, 
        price: Number, 
        image: String, 
        category: String 
    }]
});


const purchasedSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId, // Reference to the user's ID
    cname: String, // The user's name at the time of purchase
    items: [{ 
      name: String, 
      price: Number, 
      image: String, 
      category: String 
    }],
    purchaseDate: { type: Date, default: Date.now } // Date of purchase
  });
mongoose.pluralize(null);
const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);
const Purchased = mongoose.model('Purchased', purchasedSchema);

// Routes

// User Registration
app.post('/register', async (req, res) => {
    const { username, email, phone, password } = req.body;
    const newUser = new User({ username, email, phone, password });
    await newUser.save();
    res.send({ message: 'User registered successfully', user: newUser });
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.send({ message: 'Login successful', user });
    } else {
        res.status(400).send({ message: 'Invalid credentials' });
    }
});

// Add Item
app.post('/items', async (req, res) => {
    const { name, price, image, category } = req.body;
    const newItem = new Item({ name, price, image, category });
    await newItem.save();
    res.send({ message: 'Item added successfully', item: newItem });
});

// Get Items by Category
app.get('/items/:category', async (req, res) => {
    const items = await Item.find({ category: req.params.category });
    res.send(items);
});

app.post('/cart', async (req, res) => {
    const { userId, items } = req.body;
  
    try {
      // Find the user by userId to get the username
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const cname = user.username; // Fetch username from the User collection
  
      // Check if a cart already exists for this user
      let cart = await CartItem.findOne({ userId });
      
      if (!cart) {
        // If no cart exists, create a new cart for the user
        cart = new CartItem({ userId, cname, items });
      } else {
        // If the cart exists, add the items to the existing cart
        cart.items.push(...items);
        cart.cname = cname; // Ensure the username is updated in case it's changed
      }
  
      // Save the updated cart
      await cart.save();
      res.send({ message: 'Items added to cart', cart });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).send({ message: 'Server error', error });
    }
});

// Get Cart Items
app.get('/cart/:userId', async (req, res) => {
    const cart = await CartItem.findOne({ userId: req.params.userId });
    res.send(cart ? cart.items : []);
});

app.post('/buy', async (req, res) => {
    const { userId } = req.body;
    try {
      // Find the user's cart
      const cart = await CartItem.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).send({ message: 'No items in cart to purchase' });
      }
      // Move items from cart to purchased collection
      const purchased = new Purchased({
        userId: cart.userId,
        cname: cart.cname, // Get the username from the cart
        items: cart.items, // Move all items from the cart
      });
      await purchased.save();
      // Optionally, clear the cart after purchase
      cart.items = [];
      await cart.save();
      res.send({ message: 'Purchase successful', purchased });
    } catch (error) {
      console.error('Error completing purchase:', error);
      res.status(500).send({ message: 'Server error', error });
    }
  });
// Start the server
app.listen(4000, () => {
    console.log('Server is running on port 5000');
});
