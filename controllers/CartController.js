module.exports = function (localStorage) {
    return {
        index(req, res){
            let cart = JSON.parse(localStorage.getItem('cart'));
            res.render('pagesEJS/cart',{
                products: cart,
                title:"Cart"
            });
        },
        getCartVal(req, res){
            req.on("data", function (chunk) {
                let data = JSON.parse(chunk.toString());
                localStorage.setItem('cart', JSON.stringify(data));
            })
        },
        removeProduct(req, res){
            var arr = [];
            req.on("data", function (chunk) {
                var data = JSON.parse(chunk.toString());
                var cart = JSON.parse(localStorage.getItem('cart'));
                cart.forEach(function (item) {
                    if(item.name !== data.pName){
                        arr.push(item);
                        var res = JSON.stringify(arr);
                        localStorage.setItem('cart', res);
                    }
                })
            })
        }
    };
};

function sum(products) {
    var sum = 0;
    for (let i in products) {
        sum += products.price;
    }
    return sum;
}