var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

router.get("/", postController.post_list);

router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

router.get("/logout", userController.logout);

module.exports = router;