const { sendMessage, getTextMessageInput, getTemplatedMessageInput } = require("../messageHelper");


const mongoose = require('mongoose');
const XLSX = require('xlsx');

const ContactModel = require('../models/number/Contacts');
const { sendTempMsg } = require('./sendmsg');

module.exports = exports = {
  saveOneContact: async (req, res) => {
    const newContact = new ContactModel({
      name: "Priyank",
      mo_no: 9898038051,
    })
    newContact.save();

    res.send(await ContactModel.find());
  },

  SaveExcelContact: (req, res) => {
    // const filePath = 'path/to/your/excel/file.xlsx'; // replace with the path to your Excel file
    console.log(11111);
    const filePath = 'D:/Scale_Up/Whatsapp API/public/excel/2.xlsx'; // replace with the path to your Excel file

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);

    // Get the sheet name
    const sheetName = workbook.SheetNames[0];

    // Get the data from the sheet
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    // console.log(data);

    //dirct msg

    for (const key in data) {
      const element = data[key];
      // console.log(element.mo_no);
      const contact = getTemplatedMessageInput(element.mo_no);

      sendMessage(contact).then(function (response) {
        console.log("Successfully template send", element.mo_no);
      }).catch(err => {
        // console.log("Not send On" , process.env.RECIPIENT_WAID);
        console.log(err);
      })
    }


    // THrough Database

    // for (const key in data) {
    //     const element = data[key];
    //     console.log(element.mo_no);
    //       const newContact = new ContactModel(element)
    //       newContact.save();
    // }

    res.status(200).send("success")

    //  await ContactModel.insertMany(data, (err, response) => {
    //   if (err) throw err;
    //   // console.log(response.insertedCount);
    //   res.send("Successfully Added NUmber from excel")
    // })

    // console.log("done" , 1111);
    // res.json(await ContactModel.find());
  }
}