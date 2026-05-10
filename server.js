require("dotenv").config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require("connect-flash");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const productRoutes = require("./routes/productRoutes");
const checkoutRoutes = require('./routes/checkoutRoutes');

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

app.use("/", authRoutes);
app.use("/", productRoutes);
app.use('/products', productRoutes);
app.use('/', userRoutes);
app.use('/checkout', checkoutRoutes);

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