const fs = require('fs');
const path = require('path');

const getProductsData = () => {
    const filePath = path.join(__dirname, '../data/products.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

exports.getProducts = (req, res) => {
    const products = getProductsData();
    res.render('index', { products });
};

exports.getProductDetail = (req, res) => {
    const products = getProductsData();
    const productId = parseInt(req.params.id);

    const product = products.find(item => item.id === productId);

    if (!product) {
        return res.status(404).send('Ürün bulunamadı');
    }

    res.render('product-detail', { product });
};