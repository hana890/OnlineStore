module.exports = function (localStorage) {
    return {
        index(req, res){
            let cart = JSON.parse(localStorage.getItem('cart'));
            if(req.isAuthenticated()){
                //console.log('cart');
                res.render('pagesEJS/cart',{
                    products: cart,
                    title:"Cart"
                });
            } else {
                //console.log('red-login');
                res.redirect("/login/?isCart=145");
            }

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
