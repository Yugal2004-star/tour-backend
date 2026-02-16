const express = require("express");
const { sendEnquiryMail } = require("../controllers/enquiry.controller");

const router = express.Router();

router.post("/enquiry", sendEnquiryMail);

module.exports = router;
