const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  updateContact,
  getContact,
  deleteContact,
} = require("../Controllers/contactController");

const validateToken = require("../middleware/validateTokenHandler");

// Apply authentication middleware to all routes (or pass individually)
router.use(validateToken);

router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;