const fs = require('fs');
const path = require('path');

const getProductsData = () => {
    const filePath = path.join(__dirname, '../data/products.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

exports.getProducts = (req, res) => {
    const products = getProductsData();
    res.render('index', { products });
};

exports.getProductDetail = (req, res) => {
    const products = getProductsData();
    const productId = parseInt(req.params.id);
    const product = products.find(item => item.id === productId);

    if (!product) {
        return res.status(404).send('Ürün bulunamadı');
    }
    res.render('product-detail', { product });
};

// --- SEPET İŞLEMLERİ ---
exports.addToCart = (req, res) => {

    console.log("ADD TO CART ÇALIŞTI → ID:", req.params.id);

    const products = getProductsData();
    const productId = parseInt(req.params.id);
    const product = products.find(item => item.id === productId);

    if (!product) {
        return res.status(404).send('Ürün bulunamadı');
    }

    if (!req.session.cart || !Array.isArray(req.session.cart)) {
        req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        req.session.cart.push({ ...product, quantity: 1 });
    }

    res.redirect('/products/cart');
};


// Sepet sayfasını görüntülemek için gereken fonksiyon
exports.getCart = (req, res) => {
    // Session'dan sepeti al, eğer yoksa boş bir dizi oluştur
    const cart = req.session.cart || [];
    
    // Toplam tutarı hesapla
    const total = cart.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    // views/cart.ejs dosyasını render et ve verileri gönder
    res.render('cart', { cart, total }); 
};
exports.decreaseQuantity = (req, res) => {
    const productId = parseInt(req.params.id);
    let cart = req.session.cart || [];
    const item = cart.find(product => product.id === productId);

    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            req.session.cart = cart.filter(product => product.id !== productId);
        }
    }
    res.redirect('/products/cart');
};