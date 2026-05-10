const fs = require('fs');
const path = require('path');

// Yardımcı Fonksiyon: JSON dosyasından ürün verilerini çeker
const getProductsData = () => {
    const filePath = path.join(__dirname, '../data/products.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// 1. Ana Sayfa (Vitrin - Index)
exports.getProducts = (req, res) => {
    const products = getProductsData();
    res.render('index', { products });
};

// 2. Tüm Ürünler Sayfası (Arama ve Kategori Filtrelemeli)
exports.getAllProductsPage = (req, res) => {
    try {
        let products = getProductsData();
        const { search } = req.query;

        if (search) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(search.toLowerCase()) || 
                p.author.toLowerCase().includes(search.toLowerCase())
            );
        }

        res.render('products-list', { 
            products, 
            searchQuery: search || ''
        });
    } catch (error) {
        res.status(500).send("Ürünler yüklenemedi.");
    }
};

// 3. Ürün Detay Sayfası
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

// Sepet Sayfasını Görüntüle
exports.getCart = (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    res.render('cart', { cart, total }); 
};

// Sepete Ürün Ekle
exports.addToCart = (req, res) => {
    const products = getProductsData();
    const productId = parseInt(req.params.id);
    const product = products.find(item => item.id === productId);

    if (!product) {
        return res.status(404).send('Ürün bulunamadı');
    }

    if (!req.session.cart) {
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

// Sepette Miktarı Artır (+)
exports.increaseQuantity = (req, res) => {
    const productId = parseInt(req.params.id);
    if (req.session.cart) {
        const item = req.session.cart.find(p => p.id === productId);
        if (item) {
            item.quantity += 1;
        }
    }
    res.redirect('/products/cart');
};

// Sepette Miktarı Azalt (-)
exports.decreaseQuantity = (req, res) => {
    const productId = parseInt(req.params.id);
    if (req.session.cart) {
        const itemIndex = req.session.cart.findIndex(p => p.id === productId);
        if (itemIndex > -1) {
            const item = req.session.cart[itemIndex];
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Miktar 1 iken eksiye basılırsa ürünü sepetten tamamen çıkarır
                req.session.cart.splice(itemIndex, 1);
            }
        }
    }
    res.redirect('/products/cart');
};