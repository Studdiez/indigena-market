const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    NftId:String,
    WalletAddress:String,
    Price:mongoose.Schema.Types.Decimal128,
    Status:String
}, {
    timestamps: true
});

module.exports = mongoose.model('Makeoffer-Collection', NoteSchema);