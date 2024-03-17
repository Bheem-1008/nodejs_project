const mongoose = require('mongoose');
let conn = mongoose.connect("mongodb+srv://bhimchauhan262:kumar123bheem@cluster0.y7erbrr.mongodb.net/food-project?retryWrites=true&w=majority")

.then(() => console.log("connection successfully.."))
.catch((err) => console.log(err));

module.exports = conn;



