module.exports = function (pool) {
    return{
        getCategory(cb){
            pool.query("SELECT * FROM category", cb);
        },
    }
};


