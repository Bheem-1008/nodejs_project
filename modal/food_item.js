const mongoose = require('mongoose')

const food = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    photo :{
        type:String,
        required:true
    }
})

const fooditem = mongoose.model('food_item', food)
module.exports = fooditem