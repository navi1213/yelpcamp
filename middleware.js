module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()) {
        //もともとリクエストした場所を保存しておきたい
        //req.pathにはルーターから見たパスが入っている
        req.session.returnTo = req.originalUrl;
        req.flash("error","ログインしてください");
        return res.redirect("/login");
    }
    next();
}