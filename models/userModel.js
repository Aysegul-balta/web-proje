const fs = require('fs');
const path = require('path');

// Verilerin saklanacağı JSON dosyasının tam yolunu belirliyoruz
const dataPath = path.join(__dirname, '../data/users.json');

const User = {
    // Kayıtlı tüm kullanıcıları dosyadan okur
    getAll: () => {
        try {
            const data = fs.readFileSync(dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Dosya okunamazsa boş bir liste döndürür
            return [];
        }
    },

    // Yeni bir kullanıcıyı dosyaya ekler
    save: (userData) => {
        const users = User.getAll(); // Önce mevcut listeyi al
        users.push(userData);        // Yeni kullanıcıyı listeye ekle
        
        // Güncel listeyi tekrar JSON dosyasına yaz
        fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    }
};

module.exports = User;