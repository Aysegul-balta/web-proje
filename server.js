require("dotenv").config();

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

// Rotaları içeri alıyoruz
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes"); 

// Görünüm motoru ayarı
app.set("view engine", "ejs");

// --- MIDDLEWARE ---
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'aysegul_240501312_ozel_anahtar', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.error_msg = req.flash("error_msg");
    res.locals.success_msg = req.flash("success_msg");
    next();
});

// --- ROTALAR ---
app.use("/products", productRoutes); 
app.use("/", authRoutes);

app.get("/", (req, res) => {
    res.redirect("/products");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
});

app.use((req, res) => {
    res.status(404).render("404");
});