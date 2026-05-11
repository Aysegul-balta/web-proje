const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// --- 1. SABİT ROTALAR (Spesifik Sayfalar) ---
// Not: Dinamik (:id) rotaların her zaman ÜSTÜNDE olmalı.
router.get('/all', productController.getAllProductsPage);
router.get('/cart', productController.getCart);
router.get('/contact', productController.getContactPage); // İLETİŞİM BURAYA GELDİ

// --- 2. SEPET AKSİYONLARI (POST İşlemleri) ---
router.post('/cart/add/:id', productController.addToCart);
router.post('/cart/increase/:id', productController.increaseQuantity);
router.post('/cart/decrease/:id', productController.decreaseQuantity);

// --- 3. DİNAMİK ROTALAR VE ANA LİSTE ---
router.get('/', productController.getProducts); // Ana liste (Vitrin)
router.get('/:id', productController.getProductDetail); // Detay sayfası (En altta kalmalı)

module.exports = router;