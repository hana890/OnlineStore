var isCart = 0;
module.exports = function (user) {
    return {
        login(req, res) {
            if (req.isAuthenticated()){
                res.redirect("/home");
            } else {
               // console.log(req.query.isCart);
                isCart = req.query.isCart;
                res.render("pagesEJS/login", {
                    title: "Login"
                })
            }

        },
        adminLogin(req, res) {
            res.render("pagesEJS/adLogin", {
                title: "Login"
            })
        },

        register: function (req, res) {
            res.render("pagesEJS/register", {title: "Register"})
        },
        postRegister(req, res) {
            user.createUser(
                req.body.username,
                req.body.email,
                req.body.password, (err, rows) => {
                    if (err) throw new Error(err);
                    res.redirect('/login');
                });
        },
        postLogin(req, res) {
            if (isCart){
                isCart = 0;
                res.redirect("/cart");
            }else {
                res.redirect('/home');
            }
        },

        postAdminLogin(req, res) {
            res.redirect("/home");
        }
    }
};