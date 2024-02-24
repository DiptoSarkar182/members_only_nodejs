const User = require('../models/user');
const Vip = require('../models/vip');
const Admin = require('../models/admin');
const {body, validationResult} = require('express-validator');
const {createHash} = require('../passportJS/authentication');
const passport = require('passport');
const { flash } = require('express-flash');


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

    body('email')
    .optional({ checkFalsy: true })
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        return await Promise.reject("Email already taken");
      }
      return true;
    })
    .isEmail().withMessage('Not a valid e-mail address'),

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
          email: req.body.email,
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
          email: req.body.email,
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

  exports.log_in_get = (req,res,next)=>{
    return res.render("login-form", {
        title: "Log In",
        errors: req.flash("SignUpMessage"),
    })
  };

  exports.log_in_post = passport.authenticate(
    "local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    }
  )

  exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        return res.redirect("/");
    })
  };

  exports.membership_get = (req,res,next)=>{
    if(!req.user){
      return res.redirect("/login");
    }
    return res.render("membership-form", {
      title: "Become a VIP member",
    });
  };

  exports.membership_post = async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login");
    }
    
    const key = await Vip.findOne({ key: req.body.code });
    if (!key) {
      return res.render("membership-form", {
        title: "Become a VIP member",
        error: "Incorrect Code",
      });
    }
    
    try {
      const user = req.user;
      user.isMember = true;
      await user.save();
  
      return res.redirect("/");
    } catch (err) {
      return next(err);
    }
  };

  exports.admin_get = (req,res,next)=>{
    if(!req.user){
      return res.redirect("/login");
    }
    return res.render("admin-form", {
      title: "Become an admin",
    })
  };

  exports.admin_post = async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login");
    }
    const key = await Admin.findOne({ key: req.body.code });
    if (!key) {
      return res.render("admin-form", {
        title: "Become an Admin",
        error: "Incorrect Code",
      });
    }
    try {
      const user = req.user;
      user.isAdmin = true;
      user.isMember = true;
      await user.save();
  
      return res.redirect("/");
    } catch (err) {
      return next(err);
    }
  };

  exports.admin_panel_get = (req,res,next)=>{
    if(!req.user){
      return res.redirect("/login");
    }
    return res.render("admin-panel-form", {
      title: "Create secret key for ADMIN or VIP",
    })
  };

  exports.demo_user_get = async(req,res,next)=>{
    const demoUsername = "Demo_User";
    const demoUser = await User.findOne({username: demoUsername});
    if (!demoUser) {
      // Handle case when demo user is not found
      return res.redirect('/login');
  }
  req.logIn(demoUser, function(err) {
      if (err) { 
          return next(err); 
      }
      return res.redirect('/');
  });
  }

  exports.admin_panel_post = [
    async (req, res, next) => {
      try {
        const { key, fieldType } = req.body;
  
        if (fieldType === 'admin') {
          const admin = await new Admin({ key }).save();
        } else if (fieldType === 'vip') {
          const vip = await new Vip({ key }).save();
        }
  
        return res.render("admin-panel-form", {
          title: "Create secret key for ADMIN or VIP",
          successMessage: "Inserted Successfully",
        }); 
      } catch (err) {
        return next(err);
      }
    },
  ];