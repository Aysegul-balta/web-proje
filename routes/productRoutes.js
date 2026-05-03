const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/cart', productController.getCart);
router.get('/products/:id', productController.getProductDetail);
router.post('/cart/add/:id', productController.addToCart);
router.post('/cart/increase/:id', productController.increaseQuantity);
router.post('/cart/decrease/:id', productController.decreaseQuantity);

module.exports = router;