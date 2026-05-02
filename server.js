const session = require("express-session");
const express = require("express");
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

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Ana sayfa çalışıyor");
});

app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});