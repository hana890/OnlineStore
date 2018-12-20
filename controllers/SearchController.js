module.exports = function (user) {
    return{
        index(req, res){
            //console.log(`req.user: ${JSON.stringify(req.user)}`)
            if(req.isAuthenticated()){
                res.render("pagesEJS/search",{
                    title:"Search",
                    id:req.user[0].id
                })
            }else {
                res.redirect('/login');
            }
        },
        searchUsers(req,res){
            req.on("data", function (chunk) {
                var data = JSON.parse(chunk.toString());
                user.getUsers(data.symbol, call);
                function call(err, rows) {
                    if (!err) {
                        res.send(200, {message: rows});
                    }
                }
            });
        }
    }
};