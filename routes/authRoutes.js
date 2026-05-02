const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// register
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

// login
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

// profile
router.get("/profile", authController.getProfile);

module.exports = router;