const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/productModel');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const products = [
  {
    name: 'Tech Gadget X1',
    price: 299.0,
    description: 'This Tech Gadget X1 is one of our best-selling items. Experience the future with X1. It features state-of-the-art technology and a sleek design that fits any lifestyle.',
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    rating: 4.8,
    reviewsCount: 120,
    colors: ['#7B61FF', '#000000', '#A9A9A9']
  },
  {
    name: 'Luxury Watch Pro',
    price: 499.0,
    description: 'Elevate your style with the Luxury Watch Pro. Precision engineering meets elegant design.',
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    rating: 4.9,
    reviewsCount: 85,
    colors: ['#7B61FF', '#FFD700']
  },
  {
    name: 'Smart Speaker',
    price: 150.0,
    description: 'Crystal clear sound and smart home integration.',
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d',
    rating: 4.5,
    reviewsCount: 200,
    colors: ['#000000', '#FFFFFF']
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
