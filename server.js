const session = require("express-session");
const express = require("express");
const flash = require("connect-flash");
const app = express();

const authRoutes = require("./routes/authRoutes");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "gizliAnahtar",
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

app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});