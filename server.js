const fs = require('fs');
const http = require('http');

const products = require('./data/data.json');

const {getAllProducts} = require('./controllers/productController');
const {getProductById} = require('./controllers/productController');
const {createProduct} = require('./controllers/productController');
const {updateProduct} = require('./controllers/productController');
const {deleteProduct} = require('./controllers/productController');

let onlyOne = true;
let countId;

const server = http.createServer(function(req, res) {
    if (req.url === '/products' && req.method ==='GET') {
        getAllProducts(req, res)
    }
    else if (req.url.match(/\/products\/\w+/) && req.method === 'GET') {
        const id = req.url.split('/')[2];
        getProductById(req, res, id);
    }
    else if (req.url === '/products' && req.method === 'POST'){
        createProduct(req, res)
    }
    else if (req.url.match(/\/products\/\w+/) && req.method === 'DELETE') {
        const id = req.url.split('/')[2];
        deleteProduct(req, res, id);
    }
    else if (req.url.match(/\/products\/\w+/) && req.method === 'PUT') {
        const id = req.url.split('/')[2];
        updateProduct(req, res, id);
    }
    else {
        console.log('Invalid url')
    }
});

server.listen(3000, () => console.log('Server is running'));