module.exports = function (products) {
    return {
        index(req, res) {
            products.getProducts(function (err, rows) {
                console.log(__filename.slice(__filename.indexOf(__dirname) + __dirname.length + 1, __filename.length));
                if (!err && rows.length > 0) {
                    res.render('pagesEJS/products', {
                        products: rows,
                        title: "Products"
                    });
                }
            });
        },
        filter(req, res) {
            req.on("data", function (chunk) {
                var data = JSON.parse(chunk.toString());
                switch (data.filter) {
                    case "all":
                        products.getProducts(call);
                        break;
                    case "category":
                        products.findProductByCategoryName(data.category, call);
                        break;
                    case "price":
                        products.findProductByPrice(data.price, call);
                        break;
                }

                function call(err, rows) {
                    if (!err) {
                        res.send(200, {message: rows});
                    }
                }
            });
        }
    }
};