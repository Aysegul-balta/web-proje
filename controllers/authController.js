const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// users.json yolu
const usersFile = path.join(__dirname, "../data/users.json");

// GET → register sayfasını aç
exports.getRegister = (req, res) => {
  res.render("register");
};

// POST → kullanıcıyı kaydet
exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;

    if (!name || !email || !password) {
    return res.send("Lütfen tüm alanları doldurun!");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  // users.json oku
  const data = fs.readFileSync(usersFile);
  const users = JSON.parse(data);

  // yeni kullanıcı oluştur
  const newUser = {
  id: Date.now(),
  name,
  email,
  password: hashedPassword
};

  // ekle
  users.push(newUser);

  // tekrar kaydet
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.send("Kayıt başarılı!");
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

  const user = users.find(u => u.email === email);

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
exports.getProfile = (req, res) => {
  if (!req.session.user) {
    return res.send("Önce giriş yapmalısın!");
  }

  res.send(`Profil sayfası: ${req.session.user.name}`);
};