const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 1. ÖNCE SABİT ROTALAR (Spesifik sayfalar)
// Bu sayede 'all' veya 'cart' kelimeleri ID ile karışmaz
router.get('/all', productController.getAllProductsPage);
router.get('/cart', productController.getCart);

// 2. SEPET AKSİYONLARI (POST işlemleri)
router.post('/cart/add/:id', productController.addToCart);
router.post('/cart/increase/:id', productController.increaseQuantity);
router.post('/cart/decrease/:id', productController.decreaseQuantity);

// 3. EN SONA DİNAMİK ROTALAR (Değişken içerenler)
router.get('/', productController.getProducts); // Ana liste
router.get('/:id', productController.getProductDetail); // Detay sayfası (En altta kalmalı)

module.exports = router;