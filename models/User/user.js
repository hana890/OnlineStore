module.exports = function (pool) {
    return{
        createUser(username, email, password, cb){
            pool.query("INSERT INTO users SET ?",
                {   username,
                    email,
                    password
                }, cb);
        },
        findByUserName(username, password,cb){
            pool.query("SELECT * FROM users WHERE username = ? AND password = ?",
                [
                    username,
                    password
                ], cb);
        },
        findByAdminName(username, password,cb){
            pool.query("SELECT * FROM admin WHERE username = ? AND password = ?",
                [
                    username,
                    password
                ], cb);
        },
        findById(id, cb){
            var Update = '';
                //'UPDATE users SET islogin= 1 WHERE id= '  + id + ';';
            pool.query(Update + "SELECT * FROM users WHERE id = ? ",
                [id], cb);
        },
        setIsLogin(id,isLogin,cb){
            pool.query("UPDATE users SET islogin= ? WHERE id = ? ",
                [isLogin,id], cb);
        },
        findByAdminId(id, cb){
            pool.query("SELECT * FROM admin WHERE id = ? ",
                [id], cb);
        },
        getUser(id,cb){
            pool.query("SELECT * FROM users WHERE (id = ?)",
                [id], cb);
        },
        getUserAvatar(id,cb){
            pool.query("SELECT src FROM user_images WHERE (user_id = ?)",
                [id], cb);
        },
        getAdmin(id,cb){
            pool.query("SELECT * FROM admin WHERE  admin.id = ? ",
                [id], cb);
        },

        setImg(src,user_id,cb){
            pool.query("INSERT INTO user_images SET ?",
                {src, user_id}, cb);
        },
        getUsers(symbol,cb){
            var search = symbol + '%';
            pool.query('SELECT username,id,isLogin FROM users WHERE username LIKE ?',
                [search],cb)
        }
    }
};
