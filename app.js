const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Formdan gelen verileri okuyabilmek için gerekli (Middleware)
app.use(express.urlencoded({ extended: true }));

// Tüm rotalarımızı (URL yollarını) kullanıma açıyoruz
app.use('/', userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}/register`);
});