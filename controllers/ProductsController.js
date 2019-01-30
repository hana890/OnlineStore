module.exports = function (products) {
    return {
        index(req, res) {
            products.getProducts(function (err, rows) {
                //console.log(__filename.slice(__filename.indexOf(__dirname) + __dirname.length + 1, __filename.length));
                if (!err && rows.length > 0) {
                    res.render('pagesEJS/products', {
                        products: rows,
                        title: "Products"
                    })
                    // res.send(JSON.stringify(rows,null, 2));
                   // res.send('<pre>'+ JSON.stringify(rows,null, 2) + '</pre>');
                }
            });
        },
        indexParams(req, res) {
            products.getProducts(function (err, rows) {
                var id = Number(req.params.id);
                if (!err && rows.length > 0 && id >= 0 && id < rows.length) {

                    res.send('<pre>'+ JSON.stringify(rows[id],null, 2) + '</pre>');
                }else {
                    res.send("404");
                }
            });
        },
        filter(req, res) {
            req.on("data", function (chunk) {
                var data = JSON.parse(chunk.toString());
                switch (data.filter) {
                    case "all":
                        products.getProducts(cb);
                        break;
                    case "category":
                        products.findProductByCategoryName(data.category, cb);
                        break;
                    case "price":
                        products.findProductByPrice(data.price, cb);
                        break;
                }

                function cb(err, rows) {
                    if (!err) {
                        res.send(200, {message: rows});
                    }
                }
            });
        }
    }
};