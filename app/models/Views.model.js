const mongoose = require('mongoose');
const NoteSchema = mongoose.Schema({
    NftId:String,
    Views:String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Views', NoteSchema);