const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  toggleFavorite, 
  getFavorites, 
  addToCart, 
  getCart, 
  removeFromCart 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All user routes are protected

router.route('/profile').get(getUserProfile).put(updateUserProfile);
router.route('/favorites').get(getFavorites);
router.route('/favorites/:productId').post(toggleFavorite);
router.route('/cart').get(getCart).post(addToCart);
router.route('/cart/:productId').delete(removeFromCart);

module.exports = router;
