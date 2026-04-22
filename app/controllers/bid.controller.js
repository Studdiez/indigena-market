const Users = require('../models/user.model.js');
const NFT = require('../models/NFTcollection.model.js');
const BID=require('../models/bidding.model.js');
const Makeoffer=require('../models/makeoffer.model.js');
const validfn = require('../misc/validators.js');
const e = require('express');
var nodemailer = require('nodemailer');
const axios = require('axios')
const dotenv = require('dotenv');
const { insert } = require('mongodb-core/lib/wireprotocol');
dotenv.config();

exports.createbid = async(req, res) => {
    const{WalletAddress,TokenId,Price}=req.body;
    try{
        BID.create({NftId:TokenId,WalletAddress:WalletAddress,Price:Price});
        return res.status(200).send({ status: true, Message: "Sucessfully added"})
    }
    catch(e)
    {
        console.log(e);
        return res.status(404).send({ status: false})
    }
    
    
}
exports.createOffer= async(req, res) => {
   
    const{WalletAddress,TokenId,Price,status}=req.body;
    try{
        Makeoffer.create({NftId:TokenId,WalletAddress:WalletAddress,Price:Price,Status:status});
        return res.status(200).send({ status: true, Message: "Sucessfully added"})
    }
    catch(e)
    {
        console.log(e);
        return res.status(404).send({ status: false})
    }
    
    
}
exports.maxbit = async(req, res) => {

    const{TokenId}=req.body;
    try{
        
        await BID.find({NftId: TokenId}).sort({Price:-1}).limit(10).then((data)=>{
           
                return res.status(200).send({ status: true, result:data})
           
            
            
        });
     
       
    }
    catch(e)
    {
        console.log(e);
        return res.status(404).send({ status: false})
    }
    
    
}
exports.getOffer = async(req, res) => {
    const{TokenId}=req.body;
    try{
        await Makeoffer.find({NftId: TokenId}).sort({Price:-1}).then((data)=>{
           
                return res.status(200).send({ status: true, result:data})
           
            
            
        });
    }
    catch(e)
    {
        console.log(e);
        return res.status(404).send({ status: false})
    }
    
    
}

exports.updateOffer = async(req, res) => {
    const{WalletAddress,tokenId,status,_id}=req.body;
    try{
        Makeoffer.findOneAndUpdate({$and:[{WalletAddress:WalletAddress},{_id:_id},{NftId:tokenId}]},{$set:{Status:status}},{ new: true },(err,result)=>
        {
            if(err)
            {
                console.log(err)
                return res.status(404).send({ status: false})
            }
            else{
   
                return res.status(200).send({ status: true, Message:"Update Successfully"})
            }
        });
       
    }
    catch(e)
    {
        console.log(e)
        return res.status(404).send({ status: false})
    }
    
    
}
