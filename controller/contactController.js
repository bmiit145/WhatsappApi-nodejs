const mongoose = require('mongoose');
const ContactModel = require('../models/number/Contacts');

module.exports = exports = {
  saveContact: async (req, res) => {
    const newContact = new ContactModel({
      name: "PRiyank",
      mo_no: 9898038051,
    })
    newContact.save();

    res.send(await ContactModel.find());
  },
}