/*
 * GET home page.
 */

var crypto = require("crypto");
var fs = require("fs");
var User = require("../models/user.js");
var Post = require("../models/post.js");
var Comment = require("../models/comment.js");

module.exports = function (app) {
    app.get("/", function (req, res) {
        //判断是否是第一页，并把请求的页数转换成number类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回page页的10篇文章
        Post.getTen(null, page, function(err, posts, total){
            if(err){
                posts = [];
            }
            res.render("index", {
                title: "主页",
                user: req.session.user,
                page: page,
                isFirstPage: (page - 1) === 0,
                isLastPage: ((page - 1) * 10 + posts.length) == total,
                posts: posts,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            });
        });
    });
    app.get("/reg", checkNotLogin);
    app.get("/reg", function (req, res) {
        res.render("reg", {
            title: "注册",
            user: req.session.user,
            success: req.flash("success").toString(),
            error: req.flash("error").toString()
        });
    });
    app.post("/reg", checkNotLogin);
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
            password: password,
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
    app.get("/login", checkNotLogin);
    app.get("/login", function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post("/login", checkNotLogin);
    app.post("/login", function (req, res) {
        //生成密码的md5值
        var md5 = crypto.createHash("md5");
        var password = md5.update(req.body.password).digest("hex");
        //检查用户是否存在
        User.get(req.body.name, function(error, user){
            if (!user) {
                req.flash("error", "用户不存在！");
                return res.redirect("/login");  //用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.flash("error", "密码错误！");
                return res.redirect("/login");  //密码错误则跳转到登录页
            }
            //用户名和密码都匹配后，将用户信息存入session
            req.session.user = user;
            req.flash("success", "登录成功！");
            res.redirect("/");  //登录成功后挑换到首页
        });
    });
    app.get("/post", checkLogin);
    app.get("/post", function (req, res) {
        res.render("post", {
            title: "发表",
            user: req.session.user,
            success: req.flash("success").toString(),
            error: req.flash("error").toString()
        });

    });
    app.post("/post", checkLogin);
    app.post("/post", function (req, res) {
        var currentUser = req.session.user;
        var tags = [req.body.tag1, req.body.tag2, req.body.tag3];
        var post = new Post(currentUser.name, currentUser.head, req.body.title,tags, req.body.post);
        post.save(function(err){
            if(err){
                req.flash("error", err);
                return res.redirect("/");
            }
            req.flash("success", "发布成功！");
            res.redirect("/");  //发布成功跳转到主页
        });
    });
    app.get("/logout", function (req, res) {
        req.session.user = null;
        req.flash("success", "登出成功！");
        res.redirect("/");  //登出成功后跳转到主页
    });

    app.get("/upload", checkLogin);
    app.get("/upload", function(req, res){
        res.render("upload", {
            title:"文件上传",
            user:  req.session.user,
            success: req.flash("session").toString(),
            error: req.flash("error").toString()
        });
    });

    app.post("/upload", checkLogin);
    app.post("/upload", function(req, res){
        for(var i in req.files){
            if(req.files[i].size == 0){
                //使用同步方式删除一个文件
                fs.unlinkSync(req.files[i].path);
                console.log("SuccessFully removed an empty file!");
            }else{
                var target_path = "./public/images/" + req.files[i].name;
                //使用同步方式重命名一个文件
                fs.renameSync(req.files[i].path, target_path);
                console.log("Successfully renamed a file!");
            }
        }
        req.flash("success", "文件上传成功");
        res.redirect("/upload");
    });

    app.get("/links", function(req, res){
        res.render("links", {
            title: "友情连接",
            user: req.session.user,
            success: req.flash("success").toString(),
            error: req.flash("error").toString()
        });
    });

    app.get("/search", function(req, res){
        Post.search(req.query.keyword, function(err, posts){
            if(err){
                req.flash("error", err);
                return res.redirect("/");
            }
            res.render("search", {
                title: "SEARCH:" + req.query.keyword,
                posts: posts,
                user: req.session.user,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            });
        });
    });

    //访问用户页
    app.get("/u/:name", function(req, res){
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //检查用户是否存在
        User.get(req.params.name, function(err, user){
            if(!user){
                req.flash("error", "用户不存在！");
                return res.redirect("/");
            }
            //查询并返回该用户第page页的10篇文章
            Post.getTen(user.name, page, function(err, posts, total){
                if(err){
                    req.flash("error", err);
                    return res.redirect("/");
                }
                res.render("user", {
                    title: user.name,
                    posts: posts,
                    page: page,
                    isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * 10 + posts.length) == total,
                    user: req.session.user,
                    success: req.flash("success").toString(),
                    error: req.flash("error").toString()
                });
            });
        });
    });

    //访问文章页
    app.get("/u/:name/:day/:title", function(req, res){
        Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post){
            if(err){
                req.flash("error", err);
                return res.redirect("/");
            }
            res.render("article", {
                title: req.params.title,
                post: post,
                user: req.session.user,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            });
        });
    });

    app.post("/u/:name/:day/:title", function(req, res){
        var date = new Date();
        var time = date.getFullYear() + "-" + (date.getMonth() - 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        var md5 = crypto.createHash("md5");
        var email_MD5 = md5.update(req.body.email.toLowerCase()).digest("hex");
        var head = "/images/psb.jpg";
        var comment = {
            name: req.body.name,
            head: head,
            email: req.body.email,
            website: req.body.website,
            time: time,
            connent: req.body.connent
        };
        var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
        newComment.save(function(err){
            if(err){
                req.flash("error", err);
                return res.redirect("back");
            }
            req.flash("success", "留言成功！");
            res.redirect("back");
        });
    });

    app.get("/edit/:name/:day/:title", checkLogin);
    app.get("/edit/:name/:day/:title", function(req, res){
        var currentUser = req.session.user;
        Post.edit(currentUser.name, req.params.day, req.params.title, function(err, post){
            if(err){
                req.flash("error", err);
                return res.redirect("/");
            }
            res.render("edit", {
                title: "编辑",
                post: post,
                user: req.session.user,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            });
        });
    });

    app.post("/edit/:name/:day/:title", checkLogin);
    app.post("/edit/:name/:day/:title", function(req, res){
        var currentUser = req.session.user;
        Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function(err){
            var url = "/u/" + req.params.name + "/" + req.params.day + "/" + req.params.title;
            if(err){
                req.flash("error", err);
                return res.redirect(url);   //出错，返回文章页
            }
            req.flash("success", "修改成功！");
            res.redirect(url);
        });
    });

    app.get("/remove/:name/:day/:title", checkLogin);
    app.get("/remove/:name/:day/:title", function(req, res){
        var currentUser = req.session.user;
        Post.remove(currentUser.name, req.params.day, req.params.title, function(err){
            if(err){
                req.flash("error", err);
                return res.redirect("back");
            }
            req.flash("success", "删除成功！");
            res.redirect("/");
        });
    });

    app.get("/archive", function(req, res){
        Post.getArchive(function(err, posts){
            if(err){
                req.flash("error", err);
                return res.redirect("/");
            }
            res.render("archive", {
                title: "存档",
                posts: posts,
                user: req.session.user,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            });
        });
    });

    app.get("/tags", function(req, res){
        Post.getTags(function(err, posts){
            if(err){
                req.flash("error", err);
                return res.redirect("/");
            }
            res.render("tags",{
                title: "标签",
                posts: posts,
                user: req.session.user,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            });
        });
    });

    app.get("/tags/:tag", function(req, res){
        Post.getTag(req.params.tag, function(err, posts){
            if(err){
                req.flash("error", err);
                return res.redirect("/");
            }
            res.render("tag", {
                title: "TAG:"+ req.params.tag,
                posts: posts,
                user: req.session.user,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            });
        });
    });

    app.use(function(req, res){
        res.render("404");
    });
};

function checkLogin(req, res, next){
    if(!req.session.user){
        req.flash("error", "未登录！");
        res.redirect("/login");
    }
    next();
}

function checkNotLogin(req, res, next){
    if(req.session.user){
        req.flash("error", "已登录！")
        res.redirect("back");   //返回之前的页面
    }
    next();
}