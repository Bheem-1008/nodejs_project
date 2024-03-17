const mongoose = require('mongoose');

const contactSchema = mongoose.Schema( {
    Fullname : {
        type : String,
        required: true
    },
    A_email : {
        type :  String, 
        required : true
    },
    Mobile : {
        type :  Number, 
        required : true
    },
    S_email: {
        type :  String, 
        required : true
    },
    msg : {
        type :  String, 
        required : true
    },
    date : {
        type : Date,
        default :Date.now

    }

    
})

const contactModel = mongoose.model('contactuscoll', contactSchema);
module.exports = contactModel;