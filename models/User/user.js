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
        findById(id,table, cb){
            pool.query("SELECT * FROM " + table + " WHERE id = ? ",
                [id], cb);
        },
        getUser(id,table,cb){
            pool.query("SELECT * FROM "+ table +" WHERE id = ? ",
                [id], cb);
        }
    }
};
