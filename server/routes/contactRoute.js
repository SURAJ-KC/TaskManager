const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler")
const { getContacts,
        createContact,
        updateContact,
        getContact,
        deleteContact
      } = require("../Controllers/contactController")


router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;