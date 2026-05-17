require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");
const fs = require("fs");

const app = express();

// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "aysegul_bookstore_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(flash());

// --- GLOBAL VARIABLES ---
app.use((req, res, next) => {
    res.locals.error_msg = req.flash("error_msg");
    res.locals.success_msg = req.flash("success_msg");
    res.locals.user = req.session.user || null;

    if (!req.session.cart) {
        req.session.cart = [];
    }
    res.locals.cart = req.session.cart;
    next();
});

/* -----------------------------------
    1. ÖNCELİKLİ SAYFALAR
----------------------------------- */
app.get("/contact", (req, res) => { res.render("contact"); });

app.get("/", (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "products.json"), "utf8"));
        res.render("index", { products: products, searchQuery: "" });
    } catch (err) {
        res.render("index", { products: [], searchQuery: "" });
    }
});

/* -----------------------------------
    2. FAVORİ VE SEPET SİSTEMİ
----------------------------------- */
app.post("/favorite/toggle", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const productId = String(req.body.productId);
    const usersPath = path.join(__dirname, "data", "users.json");
    try {
        let users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
        let userIndex = users.findIndex(u => String(u.id) === String(req.session.user.id));

        if (userIndex !== -1) {
            // Güvenlik: favorites alanı yoksa oluştur
            if (!users[userIndex].favorites) users[userIndex].favorites = [];

            if (users[userIndex].favorites.includes(productId)) {
                users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== productId);
            } else {
                users[userIndex].favorites.push(productId);
            }
            fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
            req.session.user.favorites = users[userIndex].favorites;
            res.json({ success: true, favorites: users[userIndex].favorites });
        }
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get("/favorites", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "products.json"), "utf8"));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf8"));
    const user = users.find(u => String(u.id) === String(req.session.user.id));
    const favIds = (user.favorites || []).map(String);
    const favoriteProducts = products.filter(p => favIds.includes(String(p.id)));
    res.render("favorites", { products: favoriteProducts });
});

app.get("/cart", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    const cart = req.session.cart || [];
    let total = 0;
    cart.forEach(item => { total += parseFloat(item.price) * item.quantity; });
    res.render("cart", { cart: cart, total: total.toFixed(2) });
});

/* -----------------------------------
    3. ROTA SIRALAMASI
----------------------------------- */
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/products", productRoutes);

app.use((req, res) => { res.status(404).render("404"); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 Sunucu: http://localhost:${PORT}/`); });