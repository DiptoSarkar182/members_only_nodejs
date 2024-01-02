const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    key: {
        type: String,
        minLength: 4,
        maxLength: 20,
    },
});



module.exports = mongoose.model("Admin", AdminSchema);