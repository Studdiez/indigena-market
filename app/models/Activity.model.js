

const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    WalletAddress:String,
    Type:String,
    price:String,
    from:String,
    to:String,
    Blockchain:String,
    TokenId:String,
    Token:String,
    quantity:String
  
}, {
    timestamps: true
});

module.exports = mongoose.model('activities', NoteSchema);