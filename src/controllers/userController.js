const User = require('../models/userModel');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

// @desc    Get user profile
// @route   GET /api/user/profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle favorite
exports.toggleFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  // Clean up any corrupt null/undefined favorites first
  user.favorites = user.favorites.filter(id => id !== null && id !== undefined);

  // Type-safe comparison converting Mongoose ObjectIds to standard strings
  const isFavorite = user.favorites.some(id => id && id.toString() === productId);

  if (isFavorite) {
    user.favorites = user.favorites.filter(id => id && id.toString() !== productId);
  } else {
    user.favorites.push(productId);
  }

  await user.save();
  res.json(user.favorites);
});

// @desc    Get favorites
// @route   GET /api/user/favorites
exports.getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.json(user.favorites);
});

// @desc    Add to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);

  // Clean up any corrupt cart items with null/undefined products first
  user.cart = user.cart.filter(item => item.product !== null && item.product !== undefined);

  const cartItemIndex = user.cart.findIndex(item => item.product && item.product.toString() === productId);

  if (cartItemIndex > -1) {
    // Set absolute quantity directly as controlled by the mobile client to ensure perfect sync
    user.cart[cartItemIndex].quantity = quantity || 1;
  } else {
    user.cart.push({ product: productId, quantity: quantity || 1 });
  }

  await user.save();
  res.json(user.cart);
});

// @desc    Get cart
exports.getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  
  // Clean up database if there are any corrupt/null product entries
  const originalLength = user.cart.length;
  user.cart = user.cart.filter(item => item.product !== null && item.product !== undefined);
  if (user.cart.length !== originalLength) {
    await user.save();
  }
  
  res.json(user.cart);
});

// @desc    Remove from cart
exports.removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(item => item.product && item.product.toString() !== req.params.productId);
  await user.save();
  res.json(user.cart);
});
