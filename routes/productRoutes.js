const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// URL: localhost:3000/products/
router.get('/', productController.getProducts);

// URL: localhost:3000/products/cart
router.get('/cart', productController.getCart); 

// URL: localhost:3000/products/cart/add/:id
router.post('/cart/add/:id', productController.addToCart);

// URL: localhost:3000/products/:id
router.get('/:id', productController.getProductDetail);

// Artırma Rotası
router.post('/cart/increase/:id', productController.increaseQuantity);

// Azaltma Rotası
router.post('/cart/decrease/:id', productController.decreaseQuantity);

module.exports = router;