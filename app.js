const session = require('express-session');
const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'bookstore-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/', productRoutes);
app.use('/', userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}/`);
});