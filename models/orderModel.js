const fs = require('fs');
const path = require('path');

const ordersFile = path.join(__dirname, '../data/orders.json');

const Order = {
    getAll() {
        const data = fs.readFileSync(ordersFile, 'utf8');
        return JSON.parse(data);
    },

    save(order) {
        const orders = this.getAll();
        orders.push(order);
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    }
};

module.exports = Order;
