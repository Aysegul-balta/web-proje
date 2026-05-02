const User = require('../models/userModel');

// Kayıt sayfasını kullanıcıya gönderir
exports.getRegisterPage = (req, res) => {
    res.render('register');
};

// Formdan gelen verileri kaydeder
exports.registerUser = (req, res) => {
    const { username, password } = req.body;

    // Basit bir kontrol: Alanlar boş mu?
    if (!username || !password) {
        return res.send("Lütfen tüm alanları doldurun.");
    }

    // Veriyi modele gönderip kaydeder
    User.save({ username, password });
    res.send(`Kullanıcı ${username} başarıyla kaydedildi!`);
};