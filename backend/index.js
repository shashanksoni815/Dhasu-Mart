import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }, // 'user' or 'admin'
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Product Schema with user ownership
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  stock: Number,
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Track who created the product
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Cart Schema - Separate cart for each user
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Initialize sample data with admin user
const initializeSampleData = async () => {
  try {
    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@shopeasy.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@shopeasy.com',
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created: admin@shopeasy.com / admin123');
    }

    // Create sample products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const adminUser = await User.findOne({ email: 'admin@shopeasy.com' });
      const sampleProducts = [
        {
          name: "Wireless Bluetooth Headphones",
          price: 79.99,
          description: "High-quality wireless headphones with noise cancellation",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
          stock: 50,
          featured: true,
          trending: true,
          createdBy: adminUser._id
        },
        {
          name: "Smart Watch Series 5",
          price: 199.99,
          description: "Feature-rich smartwatch with health monitoring",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
          stock: 30,
          featured: true,
          trending: true,
          createdBy: adminUser._id
        },
        {
          name: "Running Shoes Pro",
          price: 129.99,
          description: "Comfortable running shoes for athletes",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
          stock: 25,
          featured: true,
          createdBy: adminUser._id
        }
      ];
      await Product.insertMany(sampleProducts);
      console.log('Sample products added successfully');
    }
  } catch (error) {
    console.log('Error initializing sample data:', error);
  }
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    // Create empty cart for new user
    const cart = new Cart({ user: user._id, items: [] });
    await cart.save();
    
    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email,
      role: user.role 
    }, process.env.JWT_SECRET || 'your-secret-key');
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role
      } 
    });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email,
      role: user.role 
    }, process.env.JWT_SECRET || 'your-secret-key');
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Product Routes - Only admin can create/update/delete
app.get('/api/products', async (req, res) => {
  try {
    const { featured, trending } = req.query;
    let filter = {};
    
    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;
    
    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    const productsWithFullImageUrls = products.map(product => ({
      ...product.toObject(),
      image: product.image.startsWith('http') 
        ? product.image 
        : `${req.protocol}://${req.get('host')}${product.image}`
    }));
    
    res.json(productsWithFullImageUrls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const productWithFullImageUrl = {
      ...product.toObject(),
      image: product.image.startsWith('http') 
        ? product.image 
        : `${req.protocol}://${req.get('host')}${product.image}`
    };
    
    res.json(productWithFullImageUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Only admin can create products
app.post('/api/products', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, stock, featured, trending } = req.body;
    
    const productData = {
      name,
      price: parseFloat(price),
      description,
      category,
      stock: parseInt(stock),
      featured: featured === 'true',
      trending: trending === 'true',
      image: req.file ? `/uploads/${req.file.filename}` : '/uploads/default-product.jpg',
      createdBy: req.user.userId // Set the creator as current user
    };
    
    const product = new Product(productData);
    await product.save();
    
    await product.populate('createdBy', 'name email');
    
    const productWithFullImageUrl = {
      ...product.toObject(),
      image: `${req.protocol}://${req.get('host')}${product.image}`
    };
    
    res.status(201).json(productWithFullImageUrl);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

// Only admin or product creator can update
app.put('/api/products/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is admin OR the product creator
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin' && product.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own products' });
    }
    
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.featured) updateData.featured = updateData.featured === 'true';
    if (updateData.trending) updateData.trending = updateData.trending === 'true';
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    const productWithFullImageUrl = {
      ...updatedProduct.toObject(),
      image: updatedProduct.image.startsWith('http') 
        ? updatedProduct.image 
        : `${req.protocol}://${req.get('host')}${updatedProduct.image}`
    };
    
    res.json(productWithFullImageUrl);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// Only admin or product creator can delete
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is admin OR the product creator
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin' && product.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
});

// Cart Routes - User-specific cart operations
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');
    
    if (!cart) {
      // Create empty cart if doesn't exist
      const newCart = new Cart({ user: req.user.userId, items: [] });
      await newCart.save();
      return res.json({ items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product is already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Error adding to cart', error: error.message });
  }
});

app.put('/api/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Error updating cart', error: error.message });
  }
});

app.delete('/api/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Error removing from cart', error: error.message });
  }
});

app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully', items: [] });
  } catch (error) {
    res.status(400).json({ message: 'Error clearing cart', error: error.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads directory: http://localhost:${PORT}/uploads`);
  console.log(`🔐 Admin credentials: admin@shopeasy.com / admin123`);
  
  setTimeout(initializeSampleData, 1000);
});