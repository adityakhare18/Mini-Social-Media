const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", (req, res) => {
  res.render("register");
});
router.post("/register", userController.registerUser);



router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", userController.loginUser);



router.get('/logout' , userController.logoutUser)



router.get("/profile", authMiddleware, userController.userProfile);

module.exports = router;
