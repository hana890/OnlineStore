module.exports = function (pool) {
    return{
        createProduct(name, price, img, description, category_id, cb){
            pool.query("INSERT INTO products SET ?", {
                name,
                price,
                img,
                description,
                category_id
            }, cb);
        },
        getProducts(cb){
            pool.query("SELECT * FROM products",
                cb);
        },
        getProductsCate(category,cb){
                    pool.query("SELECT * FROM products,category WHERE (category.id = products.category_id) AND (category.name =? " + category +")",
                        cb);
                },
        findProductByCategoryName(name,cb){
            pool.query("SELECT * FROM category, products WHERE(products.category_id = category.id) AND(category.name = ?)",
                [name],
                cb)
        },
        findProductByPrice(price,cb){
            pool.query("SELECT * FROM products WHERE products.price > ?",
                [price],
                cb);
        }

    }
};

/*
app.get('/search',function(req,res){
connection.query('SELECT first_name from TABLE_NAME where first_name like "%'+req.query.key+'%"',
function(err, rows, fields) {
if (err) throw err;
var data=[];
for(i=0;i<rows.length;i++)
{
data.push(rows[i].first_name);
}
res.end(JSON.stringify(data));
});
});
 */