/*
 * GET home page.
 */

var crypto = require("crypto");
var User = require("../models/user.js");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index", {title: "Express"});
    });
    app.get("/reg", function (req, res) {
        res.render("reg", {title: "注册"});
    });
    app.post("/reg", function (req, res) {
        var name = req.body.name;
        var password = req.body.password;
        var password_re = req.body["password-repeat"];
        //检查用户两次输入的米面是否一致
        if(password_re != password){
            req.flash("error", "两次输入的密码不一致！");
            return res.redirect("/reg");    //返回注册页
        }
        //生成密码的md5的值
        var md5 = crypto.createHash("md5");
        var password = md5.update(req.body.password).digest("hex");
        var newUsere = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        });
        //检查用户名是否已经存在
        User.get(newUsere.name, function(err, user){
            if(user){
                req.flash("error", "用户已存在!");
                return res.redirect("/reg");    //返回注册页
            }
            //如果不存在则更新用户
            newUsere.save(function(err, user){
                if(err){
                    req.flash("error", err);
                    return res.redirect("/reg");    //注册失败返回注册页
                }
                req.session.user = user;    //用户信息存入session
                req.flash("success", "注册成功！");
                res.redirect("/");  //注册成功后返回主页
            });
        });
    });
    app.get("/login", function (req, res) {
        res.render("login", {title: "登录"});
    });
    app.post("/login", function (res, req) {

    });
    app.get("/post", function (res, req) {
        res.render("post", {title: "发表"});
    });
    app.post("/post", function (res, req) {

    });
    app.get("/logout", function (res, req) {

    });
};