const mongoose = require('mongoose');

const addSchema = mongoose.Schema( {
    productName : {
        type : String,
        required: true
    },
    ProductPrice : {
        type :  String, 
        required : true
    },
    discount : {
        type :  String, 
        required : true
    },
    rating: {
        type :  String, 
        required : true
    },
    Country : {
        type:String,
        required: true
    },
    image: {
        type :  String, 
        required : true
    }
})

const addModel = mongoose.model('addfoodcollection', addSchema);
module.exports = addModel;