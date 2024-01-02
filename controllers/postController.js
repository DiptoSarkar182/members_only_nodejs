const Post = require('../models/post');

const { body, validationResult } = require("express-validator");

exports.post_list = async(req,res,next)=>{
    try {
        if(!req.user || !req.user.isMember){
            const posts = await Post.find()
            .sort({timestamp: -1});
            return res.render("home.pug",{
                posts: posts,
            })
        }
        const posts = await Post.find()
        .sort({timestamp: -1}).populate("user");
        return res.render("home-member", {
            posts: posts,
        })
    } catch (error) {
        return next(error);
    }
}