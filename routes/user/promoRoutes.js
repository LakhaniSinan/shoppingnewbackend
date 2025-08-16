const express = require("express");
const router = express.Router();
const { applyPromo } = require("../../controller/user/Controller");
const { verifyUser } = require("../../middlewares/user/userAuth");

router.post("/apply", verifyUser, applyPromo);

module.exports = router;
