const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// register sayfasını aç
router.get("/register", authController.getRegister);

// formdan gelen veriyi yakala
router.post("/register", authController.postRegister);

module.exports = router;