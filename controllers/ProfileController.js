module.exports = function (user) {
    return {
        index(req, res) {
           console.log(`req.user: ${JSON.stringify(req.user)}`);

            if (req.isAuthenticated()){
            user.getUser(req.user[0].id,user.table, function (err, rows) {
                if (!err && rows.length > 0) {
                    res.render('pagesEJS/profile', {title: "" + rows[0].username});

                }
            });
            }else {
                res.redirect('/login');
            }
        },
    }
};