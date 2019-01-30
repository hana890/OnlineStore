module.exports = function (user) {
    return {
        index(req, res) {
          // console.log(`req.user: ${JSON.stringify(req.user)}`);

            if (req.isAuthenticated() && user.token  === 'users'){
                if (req.params.id) user.getUser(req.params.id, cb);
                else user.getUser(req.user[0].id, cb);
            }
            else if (req.isAuthenticated() && user.token  === 'admin') {
                user.getAdmin(req.user[0].id,cb);
            }
            else {
                res.redirect('/login');
            }

            function cb(err,rows) {
                console.log(`rows: ${JSON.stringify(rows)}`);
               // console.log('user.token: ' + user.token);
                if (!err && rows.length > 0) {
                    res.render('pagesEJS/profile', {
                        title: "" + rows[0].username,
                        us_id: "" + rows[0].id,
                    });
                }else {
                    res.send("404");
                }
            }
        },
        uploadImg(req,res){
            console.log('file: ' + req.file.filename);
            user.setImg(
                req.file.filename,
                req.user[0].id, (err, rows) => {
                    // if (err) throw new Error(err);
                    console.log(err);
                    if(!err){
                        res.redirect(req.get('referer'));
                        // res.redirect('back');
                    }
                });
        },
        getAvatar(req,res){
            req.on("data", function (chunk) {
                var data = JSON.parse(chunk.toString());
                user.getUserAvatar(data.id, call);
                function call(err, rows) {
                    if (!err) {
                        res.send(200, {message: rows});
                    }
                }
            });
        }
    }
};