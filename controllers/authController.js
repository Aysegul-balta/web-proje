const fs = require("fs");
const path = require("path");

// users.json yolu
const usersFile = path.join(__dirname, "../data/users.json");

// GET → register sayfasını aç
exports.getRegister = (req, res) => {
  res.render("register");
};

// POST → kullanıcıyı kaydet
exports.postRegister = (req, res) => {
  const { name, email, password } = req.body;

  // users.json oku
  const data = fs.readFileSync(usersFile);
  const users = JSON.parse(data);

  // yeni kullanıcı oluştur
  const newUser = {
    id: Date.now(),
    name,
    email,
    password
  };

  // ekle
  users.push(newUser);

  // tekrar kaydet
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.send("Kayıt başarılı!");
};