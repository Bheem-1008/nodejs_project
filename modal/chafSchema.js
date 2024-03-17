const mongoose = require('mongoose')

const chafSchema =new mongoose.Schema({
    chafname : {
        type: String,
        required:true
    },
    experience : {
        type: String,
        required:true
    },
    picture: {
        type: String,
        required:true
    }
    
 
})

const chafs =new mongoose.model("spcail_chaf", chafSchema)
module.exports = chafs