const fs = require('fs');
const uuid = require('uuid');
const {getProducts, getById, create, deleteProd} = require('../models/productModel');
const products = require('../data/data.json');
const {getData} = require('../utils/utils');
const {writeToFile} = require('../utils/utils');

async function getAllProducts(req, res) {

    try {
        const products = await getProducts();
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.write(JSON.stringify(products));
        res.end()
    } catch (error) {
        res.writeHead(404, {'Content-Type': 'text/json'});
        res.write(JSON.stringify(error));
        res.end()
    }
}

async function getProductById(req, res, id) {

    try {
        const product = await getById(id);
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.write(JSON.stringify(product));
        res.end()
    } catch (error) {
        res.writeHead(404, {'Content-Type': 'text/json'});
        res.write(JSON.stringify({ message : "product not found"}));
        res.end()
    }
}

async function createProduct(req, res) {
    try {
        const product = await getData(req, res);
        const productObj = JSON.parse(product);
        const savedProduct = await create(productObj);
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.write(JSON.stringify({
            message: "product has been saved",
            product: savedProduct
        }));
        res.end()

    } catch (error) {
        console.log(error);
        res.writeHead(400, {'Content-type': 'text/json'});
        res.write(JSON.stringify({
            message: "Bad request"
        }));
        res.end()
    }
}

async function updateProduct(req, res, id) {
    const product = products.find((product) => product.id === id);
    if (!product){
        res.writeHead(404, {'Content-Type': 'text/json'});
        res.write(JSON.stringify({ message : "product not found"}));
    } else {
        try {
            const product = await getData(req, res);
            const { name, description, price } = JSON.parse(product);
            let updatedProduct = {
                name: name || product.name,
                description: description || product.description,
                price: price || product.price
            };

            let index = products.findIndex(p => p.id === id);

            products[index] = {
                id,
                ...updatedProduct
            };
            fs.writeFile('./data/data.json', JSON.stringify(products, null, 2), 'utf8', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.writeHead(200, {'Content-type': 'text/json'});
                    res.write(JSON.stringify({
                        message: "Product has been updated"
                    }));
                    res.end()
                }
            })
        }
        catch (error) {
            console.log(error);
            res.writeHead(400, {'Content-type': 'text/json'});
            res.write(JSON.stringify({
                message: "Bad request"
            }));
            res.end()
        }
    }
}

async function deleteProduct(req, res, id){
    try {
        const product = await getById(id);
        if (!product){
            res.writeHead(404, {'Content-Type': 'text/json'});
            res.write(JSON.stringify({ message : "product not found"}));
            res.end()
        } else {
            await deleteProd(id);
            res.end()
        }
    } catch (err) {
        console.log(error);
        res.writeHead(404, {'Content-Type': 'text/json'});
        res.write(JSON.stringify({ message : "product not found"}));
        res.end()
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};