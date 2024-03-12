const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    
        id: {
            type: String,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
    
});
const User = mongoose.model("User", UserSchema);
module.exports = User;