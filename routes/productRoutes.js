const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ana ürün listesi: /products
router.get('/', productController.getProducts);

// Sepet sayfası: /products/cart
router.get('/cart', productController.getCart);

// Ürün detay sayfası: /products/:id

router.get('/:id', productController.getProductDetail);

// Sepet işlemleri (POST)
router.post('/cart/add/:id', productController.addToCart);
router.post('/cart/increase/:id', productController.increaseQuantity);
router.post('/cart/decrease/:id', productController.decreaseQuantity);

module.exports = router;