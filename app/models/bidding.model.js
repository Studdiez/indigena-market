const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    NftId:String,
    WalletAddress:String,
    Price:mongoose.Schema.Types.Decimal128,
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Biding-Collection', NoteSchema);