const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    NftId:String,    
    WalletAddress:Array,
}, {
    timestamps: true
});

module.exports = mongoose.model('Favourites', NoteSchema);