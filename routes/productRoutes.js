const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// TÜM ÜRÜNLER LİSTESİ (Ürünlerimiz sayfası)
router.get('/all', productController.getAllProductsPage);

// SEPET SAYFASI
router.get('/cart', productController.getCart);

// SEPET İŞLEMLERİ
router.post('/cart/add/:id', productController.addToCart);
router.post('/cart/increase/:id', productController.increaseQuantity);
router.post('/cart/decrease/:id', productController.decreaseQuantity);

// ANA VİTRİN (Anasayfa yerine ürün kartları)
router.get('/', productController.getProducts);

// ÜRÜN DETAY – HER ZAMAN EN SONDA
router.get('/:id', productController.getProductDetail);

module.exports = router;
