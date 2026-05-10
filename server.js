require("dotenv").config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require("connect-flash");

// Rotaları içeri alıyoruz
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Sepet hatasını çözen kritik satır!

const app = express();

// Görünüm motoru ayarı (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- MIDDLEWARE ---
app.use(express.static(path.join(__dirname, 'public'))); // CSS ve resimlerin çalışması için
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'aysegul_bookstore_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(flash());

// Başarı/Hata mesajları (Navbar için)
app.use((req, res, next) => {
    res.locals.error_msg = req.flash("error_msg");
    res.locals.success_msg = req.flash("success_msg");
    next();
});

// --- ROTALAR ---
app.use('/products', productRoutes); 
app.use('/cart', cartRoutes); // Sepet işlemleri için bu rota şart
app.use('/', userRoutes);    // Login, Register ve Profil

// Ana sayfaya gidince direkt kitaplara yönlendir
app.get('/', (req, res) => {
    res.redirect('/products');
});

// --- SUNUCU BAŞLATMA ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}/`);
});

// 404 Sayfası
app.use((req, res) => {
    res.status(404).render("404");
});