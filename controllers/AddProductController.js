module.exports = function (category, product) {
    return {
        index(req, res){
            category.getCategory(function (err, rows) {
                console.log(req.filename);
                if(!err){
                    res.render('pagesEJS/addProduct', {
                        categories: rows,
                        title:"Add Product"
                    })
                }
            });
        },
        addProduct(req, res){
            product.createProduct(
                req.body.name,
                req.body.price,
                req.body.description,
                req.file.filename,
                req.body.category_id,
                function (err, rows) {
                    console.log(err);
                    if(!err){
                        res.redirect('/products')
                    }
                }
            )
        }
    }
};