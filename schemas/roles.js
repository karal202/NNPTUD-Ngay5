let mongoose = require('mongoose');
let roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tên không được để trống"],
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
module.exports = new mongoose.model('role', roleSchema)
