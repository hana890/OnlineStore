module.exports = function () {
    return{
        index(req, res){
            //console.log(`req.user: ${JSON.stringify(req.user)}`)
          if(req.isAuthenticated()){
                res.render("pagesEJS/home",{
                    title:"Home"
                })
           }else {
              res.redirect('/login');
          }
        },
    }
};
