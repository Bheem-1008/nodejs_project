const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema( {
    firstname : {
        type : String,
        required: true
    },
    lastname : {
        type :  String, 
        required : true
    },
    email : {
        type :  String, 
        required : true
    },
    password : {
        type :  String, 
        required : true
    },
    mobile : {
        type :  Number, 
        required : true
    },
    roll : {
        type:Number,
        default:0
    }
    
})
userSchema.pre('save', function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});
userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
}
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;