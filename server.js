require("dotenv").config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require("connect-flash");
const fs = require('fs');

const app = express();

// Rotalar
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const productRoutes = require("./routes/productRoutes");
const checkoutRoutes = require('./routes/checkoutRoutes');

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'aysegul_bookstore_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(flash());

// Global değişkenler (header için gerekli)
app.use((req, res, next) => {
    res.locals.error_msg = req.flash("error_msg");
    res.locals.success_msg = req.flash("success_msg");
    res.locals.user = req.session.user || null;
    res.locals.cart = req.session.cart || [];
    next();
});

/* -----------------------------------
   FAVORİ SİSTEMİ
----------------------------------- */
app.post('/favorite/toggle', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Lütfen giriş yapın!" });
    }

    const productId = String(req.body.productId);
    const userId = req.session.user.id;
    const usersPath = path.join(__dirname, 'data', 'users.json');

    try {
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const user = users.find(u => String(u.id) === String(userId));

        if (!user) return res.status(404).json({ success: false });

        if (!user.favorites) user.favorites = [];

        if (user.favorites.includes(productId)) {
            user.favorites = user.favorites.filter(id => id !== productId);
        } else {
            user.favorites.push(productId);
        }

        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        req.session.user.favorites = user.favorites;

        return res.json({ success: true, favorites: user.favorites });

    } catch (err) {
        return res.status(500).json({ success: false });
    }
});

/* -----------------------------------
   KLASİK SEPET (fallback için)
----------------------------------- */
app.post('/cart/add/:id', (req, res) => {
    const productId = req.params.id;

    if (!req.session.cart) req.session.cart = [];

    const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8'));
    const product = products.find(p => String(p.id) === String(productId));

    if (product) {
        const existing = req.session.cart.find(item => String(item.id) === String(productId));
        if (existing) existing.quantity++;
        else {
            req.session.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                author: product.author,
                quantity: 1
            });
        }
    }

    req.session.save(() => res.redirect('/cart'));
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

/* -----------------------------------
   CHECKOUT
----------------------------------- */
app.get('/checkout', (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect('/products');
    }

    const total = req.session.cart.reduce((t, item) =>
        t + (item.price * item.quantity), 0
    );

    res.render('checkout', { total });
});

app.post('/checkout/payment', (req, res) => {
    req.session.cart = [];
    req.session.save(() => {
        req.flash('success_msg', 'Ödeme alındı. Siparişiniz hazırlanıyor!');
        res.redirect('/products');
    });
});

/* -----------------------------------
   ROUTE KULLANIMLARI (DOĞRU SIRALAMA)
----------------------------------- */
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/products", productRoutes);
app.use("/checkout", checkoutRoutes);

app.get('/contact', (req, res) => {
    res.render('contact');
});

/* -----------------------------------
   DEFAULT ROTASI
----------------------------------- */
app.get('/', (req, res) => {
    res.redirect('/products');
});

/* -----------------------------------
   404 SAYFASI
----------------------------------- */
app.use((req, res) => {
    res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}/`);
});
