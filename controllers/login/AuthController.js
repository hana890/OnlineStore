module.exports = function (user) {

    return {
        login(req, res) {
            if (req.isAuthenticated()){
                res.redirect("/home");
            }else {
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
            res.redirect("/home");
        },

        postAdminLogin(req, res) {
            console.log("admin.isAuthenticated(): " + req.isAuthenticated());
            res.redirect('/home');
        }

        // ,
        // logout(req, res) {
        //     console.log("admin.isAuthenticated(): " + req.isAuthenticated());
        //     req.logout();
        //     res.redirect('/login');
        //
        // }
    }
};