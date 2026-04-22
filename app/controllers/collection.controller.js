const Users = require("../models/user.model.js");
const NFT = require("../models/NFTcollection.model.js");
const BID = require("../models/bidding.model.js");
const Collection = require("../models/Collection.model.js");
const validfn = require("../misc/validators.js");
const e = require("express");
var nodemailer = require("nodemailer");
const axios = require("axios");
const dotenv = require("dotenv");
const { insert } = require("mongodb-core/lib/wireprotocol");

dotenv.config();

exports.createcollection = async (req, res) => {

  req.body.WalletAddress = req.body.WalletAddress.toString().toLowerCase();

  try {
    Collection.create(req.body);
    return res.status(200).send({ status: true, Message: "Sucessfully added" });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};
exports.getcollections = async (req, res) => {

  const { WalletAddress, from, CollectionName, _id } = req.body;
  if (from == "profile") {
    try {
      Collection.find({
        $and: [
          { WalletAddress: WalletAddress.toString().toLowerCase() },
          { IsBlock: { $ne: true } },
        ],
      }).then((data) => {
        return res.status(200).send({ status: true, result: data });
      });
    } catch (e) {
      console.log(e);
      return res.status(404).send({ status: false });
    }
  } else if (from == "profile-collection") {
    try {
      Collection.find({
        $and: [{ CollectionName: CollectionName }, { IsBlock: { $ne: true } }],
      }).then((data) => {
      
        if (data[0].TokenId.length > 0) {
          NFT.find({
            $and: [{ NftId: data[0].TokenId }, { IsBlock: { $ne: true } }],
          })
            .sort({ Price: -1 })
            .limit()
            .then((resultdata) => {
              var count;
              if (resultdata.length > 0) {
                count = 0;
                let totalAmount = 0;
                resultdata.map((e, i) => {
                  count = count + 1;
                  if (e.Price) {
                    totalAmount = totalAmount + parseFloat(e.Price);
                  }
                  if (count == resultdata.length) {
       
                   
                    data[0].FloorPrice = (totalAmount / count).toFixed(2);
                    return res
                      .status(200)
                      .send({
                        status: true,
                        result: resultdata,
                        Collectiondata: data,
                      });
                 }
                });
              }
            });
        } else {
          data[0].FloorPrice = 0;
          return res
            .status(200)
            .send({ status: true, Collectiondata: data, result: [] });
        }
   });
    } catch (e) {
      console.log(e);
      return res.status(404).send({ status: false });
    }
  } else if (from == "stats") {
    try {
      Collection.find({
        $and: [{ "TokenId.0": { $exists: true } }, { IsBlock: { $ne: true } }],
      })
        .sort()
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    } catch (e) {
      console.log(e);
      return res.status(404).send({ status: false });
    }
  } else {
    try {
      Collection.find({
        $and: [
          { WalletAddress: WalletAddress.toString().toLowerCase() },
          { IsBlock: { $ne: true } },
        ],
      }).then((data) => {
        return res.status(200).send({ status: true, result: data });
      });
    } catch (e) {
      console.log(e);
      return res.status(404).send({ status: false });
    }
  }
};

exports.getAllcollection = async (req, res) => {
  try {
    Collection.find({ IsBlock: { $ne: true } }).then((data) => {
      if (data.length > 0) {
        var collectiondata = [];
        var datacount = 0;
        data.map((collection) => {
          NFT.find({
            $and: [{ NftId: collection.TokenId }, { IsBlock: { $ne: true } }],
          })
            .sort({ Price: -1 })
            .limit()
            .then((resultdata) => {
              var count;
              if (resultdata.length > 0) {
                datacount = datacount + 1;
                count = 0;
                let totalAmount = 0;
                resultdata.map((e, i) => {
                  count = count + 1;
                  if (e.Price) {
                    totalAmount = totalAmount + parseFloat(e.Price);
                  }
                  if (count == resultdata.length) {
          
                    collection.FloorPrice = (totalAmount / count).toFixed(2);
                    collectiondata.push(collection);
                    if (datacount == data.length) {
                
                      return res
                        .status(200)
                        .send({ status: true, result: collectiondata });
                    }
                 }
                });
              } else {
                datacount = datacount + 1;
                collection.FloorPrice = 0;
                collectiondata.push(collection);

                if (datacount == data.length) {
                  return res
                    .status(200)
                    .send({ status: true, result: collectiondata });
                }
              }
            });
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.Top7Collection = async (req, res) => {
  try {
    const sortBy = "TokenId";
    const orderBy = -1;
    var count = 0;
    let nftids = [];
    let todaydate = new Date();
    const getenddate = new Date(
      todaydate.getFullYear(),
      todaydate.getMonth(),
      todaydate.getDate() - 7
    );
    const questions = await Collection.aggregate()
      .addFields(
        { length: { $size: `$${sortBy}` } },
        { updatedAt: { $gte: getenddate, $lte: todaydate } }
      )
      .sort({ length: -1 })
      .then(async (data) => {
        var collectiondata = [];
        var datacount = 0;
        data.map((collection) => {
          NFT.find({
            $and: [{ NftId: collection.TokenId }, { IsBlock: { $ne: true } }],
          })
            .sort({ Price: -1 })
            .limit()
            .then((resultdata) => {
              var count;
              if (resultdata.length > 0) {
                datacount = datacount + 1;
                count = 0;
                let totalAmount = 0;
                resultdata.map((e, i) => {
                  count = count + 1;
                  if (e.Price) {
                    totalAmount = totalAmount + parseFloat(e.Price);
                  }
                  if (count == resultdata.length) {
                
                    collection.FloorPrice = (totalAmount / count).toFixed(2);
                    collectiondata.push(collection);
                    if (datacount == data.length) {
                

                      let sortData = collectiondata.sort(function (a, b) {
                        return b.length - a.length;
                      });
              
                      return res
                        .status(200)
                        .send({ status: true, s: "okk", result: sortData });
                    }
                  }
                });
              } else {
                datacount = datacount + 1;
                collection.FloorPrice = 0;
                collectiondata.push(collection);

                if (datacount == data.length) {
                  let sortData = collectiondata.sort(function (a, b) {
                    return b.length - a.length;
                  });
        
                  return res
                    .status(200)
                    .send({ status: true, s: "ddd", result: sortData });
                }
              }
            });
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.statAllcollection = async (req, res) => {
  const { daycount } = req.body;
  let todaydate = new Date();

 const getenddate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate() - daycount
  );

  try {
    Collection.find({
      $and: [
        { updatedAt: { $gte: getenddate, $lte: todaydate } },
        { IsBlock: { $ne: true } },
      ],
    }).then((data) => {
      return res.status(200).send({ status: true, result: data });
    });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.checkcollection = async (req, res) => {
  const { CollectionName } = req.body;
  try {
    Collection.find({ CollectionName: CollectionName }).then((data) => {
      if (data.length > 0) {
        return res.status(200).send({ status: true, result: true });
      } else {
        return res.status(200).send({ status: true, result: false });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};
exports.updateCollection = async (req, res) => {
  const { WalletAddress } = req.body;
  var query = { IsBlock: true };
  try {
    if (req.body.type == "updatedatails") {
      Collection.updateOne(
        { _id: req.body._id },
        { $set: req.body },
        { upsert: false },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            return res.status(200).send({ success: true, result: true });
          }
        }
      );
    } else {
      Users.findOneAndUpdate(
        { WalletAddress: WalletAddress.toLowerCase() },
        { $set: query },
        { new: true },
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(404).send({ status: false });
          } else {

            Collection.find(
              { WalletAddress: WalletAddress.toLowerCase() },
              (err, result) => {
                if (err) {
                  console.log(err);
                  return res.status(404).send({ status: false });
                } else {
                  result.map((collectiondata, i) => {
                    Collection.updateOne(
                      { _id: collectiondata._id },
                      { $set: query },
                      { upsert: false },
                      (err, result) => {
                        if (err) {
                          console.log(err);
                        }
             

                        if (i == result.length - 1) {
                          return res
                            .status(200)
                            .send({ success: true, result: true });
                        }
                      }
                    );
                  });
                }
              }
            );
          }
        }
      );
    }
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.Searchcollection = async (req, res) => {
  const { searchInput, value, min, max } = req.body;
  var query;

  if (searchInput == "usd") {
    query = { $and: [{ Blockchain: value }] };
  } else if (searchInput == "search") {
    query = { $and: [{ CollectionName: { $regex: value, $options: "i" } }] };
  } else if (searchInput == "select") {
    if (value == "Price Low - High") {
 
      await Collection.find({})
        .sort({ FloorPrice: 1 })
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    } else if (value == "Price High - Low") {
  
      await Collection.find({})
        .sort({ FloorPrice: -1 })
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    } else if (value == "Recently Listed") {

      await Collection.find({})
        .sort({ createdAt: -1 })
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    } else {
 
      await Collection.find({})
        .sort({ AuctionEndDate: 1 })
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    }
  }

  if (searchInput != "select") {
    Collection.find(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send({ status: false });
      } else {

        return res.status(200).send({ status: true, result: result });
      }
    });
  }
};
