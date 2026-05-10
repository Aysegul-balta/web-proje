const express = require('express');
const router = express.Router();

// Ödeme sayfası
router.get('/', (req, res) => {
    res.render('checkout');
});

// Ödeme gönderildiğinde
router.post('/complete', (req, res) => {
    // Fake işlem – gerçek ödeme sistemi eklersen burada olacak
    req.session.cart = []; // sepeti temizle
    res.render('checkout-success');
});

module.exports = router;
