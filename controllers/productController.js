const fs = require('fs');
const path = require('path');

exports.getProducts = (req, res) => {
    const filePath = path.join(__dirname, '../data/products.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    res.render('index', { products: data });
};