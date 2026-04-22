const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    WalletAddress:String,
    Description:String,
    LogoImage:String,
    FeaturedImage:String,
    BannerImage:String,
    CollectionName:String,
    Royality:String,
    Categery:String,
    TokenId:Array,
    Blockchain:String,
    FloorPrice:String,
    IsBlock:Boolean,
}, {
    timestamps: true
});

module.exports = mongoose.model('Collection-detail', NoteSchema);