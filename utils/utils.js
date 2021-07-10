const fs = require('fs');
const products = require('../data/data.json');

function getData(req, res) {
    const promise = new Promise((resolve, reject) => {
        let body = '';
        req.on('data', function(chunk) {
            body += chunk
        });

        req.on('end', function() {
            resolve(body)
        });
        req.on('error', function(err) {
            console.log(err);
            reject('Error')
        })
    });

    return promise;
}

function writeToFile(req, res) {
    fs.writeFile('./data/data.json', JSON.stringify(products, null, 2), 'utf8', function(err) {
        if (err) {
            console.log(err);
        } else {
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.write(JSON.stringify({
                message: "Product has been saved"
            }));
            res.end()
        }
    })
}

module.exports = {
    getData,
    writeToFile
};