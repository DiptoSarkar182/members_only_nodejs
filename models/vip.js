const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VipSchema = new Schema({
    key: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
    },
});



module.exports = mongoose.model("Vip", VipSchema);