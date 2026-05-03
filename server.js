require("dotenv").config();

const session = require("express-session");
const express = require("express");
const flash = require("connect-flash");
const app = express();

const authRoutes = require("./routes/authRoutes");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");
  next();
});

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Ana sayfa çalışıyor");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(404).render("404");
});