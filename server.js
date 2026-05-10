require("dotenv").config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require("connect-flash");

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); 
// Buradaki cartRoutes require satırını sildik çünkü öyle bir dosya yok!

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

app.use((req, res, next) => {
    res.locals.error_msg = req.flash("error_msg");
    res.locals.success_msg = req.flash("success_msg");
    next();
});

// --- ROTALAR ---
// Arkadaşın sepeti /products altına koyduğu için her şey buradan dönecek
app.use('/products', productRoutes); 
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.redirect('/products');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}/`);
});

app.use((req, res) => {
    res.status(404).render("404");
});