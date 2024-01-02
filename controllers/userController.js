const User = require('../models/user');
const {body, validationResult} = require('express-validator');
const {createHash} = require('../passportJS/authentication');


exports.sign_up_get = (req,res,next)=>{
    return res.render("sign-up-form", {
        title: "Welcome to sign up form",
    });
};

exports.sign_up_post = [
    body("username")
      .trim()
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          return await Promise.reject("Username already taken");
        }
        return true;
      })
      .isLength({ min: 4, max: 20 })
      .withMessage("Username is required (4-20 characters) ")
      .escape(),

    body("firstname", "Firstname is required (3-20 characters) ")
      .trim()
      .isLength({ min: 3, max: 20 })
      .escape(),
    body("lastname", "Lastname is required (3-18 characters) ")
      .trim()
      .isLength({ min: 2, max: 18 })
      .escape(),
    body("password", "Password should be atleast 6 characters long")
      .trim()
      .isLength({ min: 6 })
      .escape(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    async (req, res, next) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        const user = new User({
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
        });
        return res.render("sign-up-form", {
          title: "Create account",
          user: user,
          errors: errors.array(),
        });
      }
  
      try {
        const passwordHash = await createHash(req.body.password);
        const user = await new User({
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: passwordHash,
        }).save();
  
        await req.login(user, (err) => {
          if (err) return next(err);
          return res.redirect("/");
        });
      } catch (err) {
        return next(err);
      }
    },
  ];

  exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        return res.redirect("/");
    })
  }