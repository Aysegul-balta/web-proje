const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const usersFile = path.join(__dirname, "../data/users.json");

// GET → register sayfasını aç
exports.getRegister = (req, res) => {
  res.render("register");
};

// POST → kullanıcıyı kaydet
exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    req.flash("error_msg", "Lütfen tüm alanları doldurun!");
    return res.redirect("/register");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    req.flash("error_msg", "Lütfen geçerli bir email adresi girin!");
    return res.redirect("/register");
  }

  if (password.length < 6) {
    req.flash("error_msg", "Şifre en az 6 karakter olmalıdır!");
    return res.redirect("/register");
  }

  const data = fs.readFileSync(usersFile);
  const users = JSON.parse(data);

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    req.flash("error_msg", "Bu email zaten kayıtlı!");
    return res.redirect("/register");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword
  };

  users.push(newUser);

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  req.flash("success_msg", "Kayıt başarılı! Giriş yapabilirsiniz.");
  res.redirect("/login");
};

// GET → login sayfasını aç
exports.getLogin = (req, res) => {
  res.render("login");
};

// POST → login kontrolü
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  const data = fs.readFileSync(usersFile);
  const users = JSON.parse(data);

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.send("Kullanıcı bulunamadı!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.send("Şifre yanlış!");
  }

  req.session.user = user;

  res.send(`Hoş geldin ${user.name}`);
};

// GET → profil sayfası
exports.getProfile = (req, res) => {
  if (!req.session.user) {
    return res.send("Önce giriş yapmalısın!");
  }

  res.send(`Profil sayfası: ${req.session.user.name}`);
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};