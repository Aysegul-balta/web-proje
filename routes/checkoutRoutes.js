const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// Ödeme sayfası
router.get('/', (req, res) => {
    res.render('checkout');
});

// Ödeme tamamlandığında
router.post('/complete', (req, res) => {

    // 1) Önce sepeti al (temizlemeden önce)
    const cart = req.session.cart || [];

    console.log("SEPET DURUMU:", cart);

    if (cart.length === 0) {
        return res.send("Sepet boş, sipariş alınamadı.");
    }

    // 2) Sipariş objesini oluştur
    const order = {
        id: Date.now().toString(),
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toLocaleString()
    };

    console.log("KAYDEDİLEN SİPARİŞ:", order);

    // 3) Siparişi orders.json’a yaz
    Order.save(order);

    // 4) Sepeti kaydettikten sonra temizle
    req.session.cart = [];

    // 5) Başarı ekranı
    res.render('checkout-success');
});

module.exports = router;
