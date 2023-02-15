const mongoose =  require('mongoose');


const ContactSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    mo_no:{
        type:Number,
        required: true,
        unique:true
    }
})

module.exports = mongoose.model( "Contacts" , ContactSchema);