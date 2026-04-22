const Users = require("../models/user.model.js");
const NFT = require("../models/NFTcollection.model.js");
const Colection = require("../models/Collection.model.js");
const Views = require("../models/Views.model.js");
const Favourites = require("../models/Favourites.model.js");
const Activity = require("../models/Activity.model.js");
const validfn = require("../misc/validators.js");
const signature = require("./signature");
const xrplClient = require("../../config/xrpl.config.js");
const e = require("express");
var nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
exports.createnft = async (req, res) => {
  const {
    WalletAddress,
    TokenId,
    Jsondataurl,
    CollectionName,
    AwsUrl,
    ItemName,
    Poperties,
    Levels,
    Stats,
    Blockchain,
    Type,
    Pinatahash
  } = req.body;
  try {
    await Users.find({
      WalletAddress: WalletAddress.toString().toLowerCase(),
    }).then(async (data) => {
      const olddata = data[0];
      let nfttabledata = {
        NftId: TokenId,
        Jsondataurl: Jsondataurl,
        Status: "Mint",
        Imageurl: AwsUrl,
        ItemName: ItemName,
        Properties: Poperties,
        Stats: Stats,
        Levels: Levels,
        Blockchain: Blockchain,
        Type: Type,
        CollectionName: CollectionName,
        Pinatahash:Pinatahash
      };
      await insertnft(nfttabledata);
      if (data.length > 0) {
        let TokenArray = data[0].TokenId;
        TokenArray.push(TokenId);
        Users.findOneAndUpdate(
          { WalletAddress: WalletAddress.toString().toLowerCase() },
          { TokenId: TokenArray },
          { useFindAndModify: false },
          (err, result) => {
            if (err) {
              return res.status(404).send({ status: false });
            }
          }
        );
      } else {
        let data = {};
        let arratdata = [];
        arratdata.push(TokenId);
        console.group(arratdata);

        data["WalletAddress"] = WalletAddress.toString().toLowerCase();
        data["TokenId"] = arratdata;
        data["UserName"] = " ";
        data["PrifileUrl"] = " ";
        let response = await Users.create(data);
      }
    });

    await Colection.find({
      $and: [
        { WalletAddress: WalletAddress.toString().toLowerCase() },
        { CollectionName: CollectionName },
      ],
    }).then(async (data) => {
      if (data.length > 0) {
        let TokenArray = data[0].TokenId;

        TokenArray.push(TokenId);

        Colection.updateOne(
          { _id: data[0]._id },
          { $set: { TokenId: TokenArray } },
          { upsert: false },
          (err, result) => {
            if (err) {
              return res.status(404).send({ status: false });
            } else {
              return res
                .status(200)
                .send({ success: true, Message: "Sucessfully nft created" });
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ status: false });
  }
};

exports.getnft = async (req, res) => {
  try {
    const { WalletAddress } = req.body;
    let updatestatus = await userdetails(
      WalletAddress.toString().toLowerCase()
    );

    let getdata = Users.find({
      WalletAddress: WalletAddress.toString().toLowerCase(),
    }).then((data) => {
      if (data.length > 0) {
        return res.status(200).send({ success: true, result: data });
      } else {
        return res.status(404).send({ status: false });
      }
    });
  } catch (err) {
    return res.status(404).send({ status: false });
  }
};
insertnft = async (data) => {
  NFT.find({ NftId: data.NftId }).then((resultdata) => {
    if (resultdata.length) {
      let result = NFT.findOneAndUpdate(
        { NftId: data.NftId },
        {
          Jsondataurl: data.Jsondataurl,
          Status: "Mint",
          Imageurl: data.Imageurl,
          ItemName: data.ItemName,
        },
        { new: true },
        (err, result) => {
          if (err) {
            return 0;
          } else {
            return 1;
          }
        }
      );
    } else {
      NFT.create(data);
    }
  });
};
delay = async (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

// Fetch user NFTs from XRPL instead of Moralis (EVM chains)
userdetails = async (address) => {
  try {
    var token_id = [];

    // Fetch NFTs from XRPL
    const xrplNFTs = await xrplClient.getAccountNFTs(address);
    
    xrplNFTs.forEach((token) => {
      token_id.push("XRPL-" + token.NFTokenID);
    });

    // Update user record with token IDs
    Users.find({ WalletAddress: address }).then((userdata) => {
      if (userdata.length > 0) {
        let result = Users.findOneAndUpdate(
          { WalletAddress: address },
          { TokenId: token_id },
          { useFindAndModify: false },
          (err, result) => {
            if (err) {
              return 0;
            } else {
              return 1;
            }
          }
        );
      } else {
        let data = {};
        data["WalletAddress"] = address;
        data["TokenId"] = token_id;
        Users.create(data);
        return 0;
      }
    });
  } catch (e) {
    console.error('Error fetching user NFTs from XRPL:', e);
    return 0;
  }
};
exports.updatenftprice = async (req, res) => {
  const { tokenId, price, status, enddate } = req.body;
  let query = { Price: price, Status: status };

  if (status == "Auction") {
    query = { Price: price, Status: status, AuctionEndDate: enddate };
  } else if (status == "Block") {
    query = { IsBlock: true };
  } else if (status == "Auction Expired") {
    query = { Status: "Buy" };
  }

  try {
    NFT.findOneAndUpdate(
      { NftId: tokenId },
      { $set: query },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(404).send({ status: false });
        } else {
          return res
            .status(200)
            .send({ status: true, Message: "Update Successfully" });
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.Todaynft = async (req, res) => {
  let todaydate = new Date();
  const getenddate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate() - 1
  );
  NFT.find({ IsBlock: { $ne: true } })
    .sort({ updatedAt: -1 })
    .limit(8)
    .then((data) => {
      return res.status(200).send({ status: true, result: data });
    })
    .catch((err) => {
      return res.status(404).send({ status: false });
    });
};

exports.getAll = async (req, res) => {
  NFT.aggregate(
    [
      {
        $project: {
          _id: { $toObjectId: "$_id" },
          Properties: "$Properties",
          Stats: "$Stats",
          Levels: "$Levels",
          NftId: "$NftId",
          Jsondataurl: "$Jsondataurl",
          Status: "$Status",
          Imageurl: "$Imageurl",
          ItemName: "$ItemName",
          Blockchain: "$Blockchain",
          Type: "$Type",
          CollectionName: "$CollectionName",
          AuctionEndDate: "$AuctionEndDate",
          Price: "$Price",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
      { $match: { IsBlock: { $ne: true } } },
      {
        $lookup: {
          from: "collection-details",
          localField: "CollectionName",
          foreignField: "CollectionName",
          as: "collection",
        },
      },
      { $sort: { createdAt: -1 } },
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send({ status: false });
      } else {
        return res.status(200).send({ status: true, result: result });
      }
    }
  );
};

exports.SearchgetAll = async (req, res) => {
  const { searchInput, value, min, max } = req.body;

  var query;

  if (searchInput == "type") {
    query = { $and: [{ Type: value }] };
  } else if (searchInput == "button") {
    query = { $and: [{ Status: value }] };
  } else if (searchInput == "usd") {
    query = {
      $and: [{ Blockchain: value }, { Price: { $gte: min, $lte: max } }],
    };
  } else if (searchInput == "search") {
    query = { $and: [{ CollectionName: { $regex: value, $options: "i" } }] };
  } else if (searchInput == "select") {
    if (value == "Price Low - High") {
      await NFT.find({ IsBlock: { $ne: true } })
        .sort({ Price: 1 })
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    } else if (value == "Price High - Low") {
      await NFT.find({ IsBlock: { $ne: true } })
        .sort({ Price: -1 })
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    } else if (value == "Recently Listed") {
      await NFT.find({ IsBlock: { $ne: true } })
        .sort({ createdAt: -1 })
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    } else {
      await NFT.find({ IsBlock: { $ne: true } })
        .sort({ AuctionEndDate: 1 })
        .then((data) => {
          return res.status(200).send({ status: true, result: data });
        });
    }
  } else {
    query = {
      $and: [
        { $or: [{ Status: "Fixedprice" }, { Status: "Auction" }] },
        { IsBlock: { $ne: true } },
      ],
    };
  }
  if (searchInput != "select") {
    NFT.aggregate(
      [
        {
          $project: {
            _id: { $toObjectId: "$_id" },
            Properties: "$Properties",
            Stats: "$Stats",
            Levels: "$Levels",
            NftId: "$NftId",
            Jsondataurl: "$Jsondataurl",
            Status: "$Status",
            Imageurl: "$Imageurl",
            ItemName: "$ItemName",
            Blockchain: "$Blockchain",
            Type: "$Type",
            CollectionName: "$CollectionName",
            AuctionEndDate: "$AuctionEndDate",
            Price: "$Price",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
        { $match: query },
        {
          $lookup: {
            from: "collection-details",
            localField: "CollectionName",
            foreignField: "CollectionName",
            as: "collection",
          },
        }, //{"$unwind": "$admin" },
        { $sort: { createdAt: -1 } },
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(404).send({ status: false });
        } else {
          return res.status(200).send({ status: true, result: result });
        }
      }
    );
  }
};
exports.editprofile = async (req, res) => {
  req.body.WalletAddress = req.body.WalletAddress.toString().toLowerCase();
  try {
    Users.findOneAndUpdate(
      { WalletAddress: req.body.WalletAddress.toString().toLowerCase() },
      { $set: req.body },
      { useFindAndModify: false },
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(404).send({ status: false });
        } else {
          return res
            .status(200)
            .send({ status: true, Message: "Update Successfully" });
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.TotalAmount = async (req, res) => {
  const { daycount } = req.body;
  let todaydate = new Date();

  const getenddate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate() - daycount
  );
  NFT.find(
    {
      $and: [
        { updatedAt: { $gt: getenddate, $lt: todaydate } },
        { IsBlock: { $ne: true } },
      ],
    },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send({ status: false });
      } else {
        if (result.length > 0) {
          let count = 0;
          let totalAmount = 0;
          result.map((e, i) => {
            count = count + 1;

            if (e.Price) {
              totalAmount = totalAmount + parseFloat(e.Price);
            }
            if (count == result.length) {
              return res.status(200).send({
                status: true,
                result: [{ totalAmount: totalAmount, count: result.length }],
              });
            }
          });
        }
      }
    }
  );
};

exports.Top15collections = async (req, res) => {
  let todaydate = new Date();
  todaydate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate()
  );
  const getenddate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate() - 6
  );
  try {
    await NFT.find({
      $and: [
        { updatedAt: { $gt: getenddate, $lt: todaydate } },
        { IsBlock: { $ne: true } },
      ],
    })
      .sort({ Price: -1 })
      .limit(15)
      .then((data) => {
        return res.status(200).send({ status: true, result: data });
      });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.FindNft = async (req, res) => {
  var token_id = [];
  const { WalletAddress } = req.body;
  
  try {
    // Update user NFTs from XRPL
    let updatestatus = await userdetails(WalletAddress.toString().toLowerCase());
    
    // Fetch NFTs from XRPL
    const xrplNFTs = await xrplClient.getAccountNFTs(WalletAddress.toString().toLowerCase());
    
    xrplNFTs.forEach((token) => {
      token_id.push("XRPL-" + token.NFTokenID);
    });

    await NFT.find({ $and: [{ NftId: token_id }, { IsBlock: { $ne: true } }] })
      .sort({ Price: -1 })
      .limit()
      .then((data) => {
        return res.status(200).send({ status: true, result: data });
      });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.FindCollectionNft = async (req, res) => {
  const { tokenId, daycount } = req.body;

  let todaydate = new Date();

  const getenddate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate() - daycount
  );

  try {
    await NFT.find({
      $and: [
        { NftId: tokenId },
        { updatedAt: { $gte: getenddate, $lte: todaydate } },
        { IsBlock: { $ne: true } },
      ],
    })
      .sort({ Price: -1 })
      .limit()
      .then((data) => {
        return res.status(200).send({ status: true, result: data });
      });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};
exports.GetViews = async (req, res) => {
  await Views.find({ NftId: req.body.NftId }).then(async (data) => {
    if (data.length > 0) {
      let count = parseInt(data[0].Views) + 1;
      count = count.toString();
      if(req.body.address==""){
        return res.status(200).send({ success: true, result: data });
      }
      Views.updateOne(
        { _id: data[0]._id },
        { $set: { Views: count } },
        { upsert: false },
        (err, result) => {
          if (err) {
            return res.status(404).send({ status: false });
          } else {
            return res.status(200).send({ success: true, result: data });
          }
        }
      );
    } else {
      let data = {};
      data["NftId"] = req.body.NftId;
      data["Views"] = "1";
      Views.create(data);
      return res.status(200).send({ success: true, result: [data] });
    }
  });
};

exports.GetPropertiesnft = async (req, res) => {
  await NFT.find({
    $and: [
      { IsBlock: { $ne: true } },
      {
        Properties: {
          $elemMatch: {
            $and: [
              { trait_type: req.body.character },
              { value: req.body.name },
            ],
          },
        },
      },
    ],
  }).then(async (data) => {
    if (data.length > 0) {
      return res.status(200).send({ success: true, result: data });
    } else {
      return res.status(200).send({ success: true, result: [] });
    }
  });
};

exports.checkname = async (req, res) => {
  const { ItemName } = req.body;
  try {
    NFT.find({ ItemName: ItemName }).then((data) => {
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

exports.checkUserStatus = async (req, res) => {
  const { WalletAddress } = req.body;
  try {
    Users.find({
      $and: [{ WalletAddress: WalletAddress.toLowerCase() }, { IsBlock: true }],
    }).then((data) => {
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

exports.getsignature = async (req, res) => {
  try {
    const {
      seller,
      buyer,
      nftAddress,
      inEth,
      _orderType,
      amount,
      tokenId,
      qty,
      timestamp,
      Blockchain,
    } = req.body;
    const data = await signature.signTransaction(
      seller,
      buyer,
      nftAddress,
      inEth,
      _orderType,
      amount,
      tokenId,
      qty,
      timestamp,
      Blockchain
    );

    return res.status(200).json({
      success: true,
      result: data,
    });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.AddFavourites = async (req, res) => {
  try {
    const { NftId, WalletAddress } = req.body;
    Favourites.find({ NftId: NftId }).then((result) => {
      if (result.length > 0) {
        let wallet_address = result[0].WalletAddress;
        let duplicate = wallet_address.filter((e) => e == WalletAddress);
        if (duplicate.length > 0) {
          res.status(200).send({ success: false });
        } else {
          wallet_address.push(WalletAddress);
          Favourites.updateOne(
            { NftId: NftId },
            { WalletAddress: wallet_address },
            { upsert: false },
            (err, result) => {
              if (err) {
                return res.status(404).send({ status: false });
              } else {
                return res
                  .status(200)
                  .send({ success: true, result: wallet_address.length });
              }
            }
          );
        }
      } else {
        let wallet_address = [];
        wallet_address.push(WalletAddress);
        let data = {};
        data["NftId"] = NftId;
        data["WalletAddress"] = wallet_address;
        Favourites.create(data);
        return res.status(200).send({ success: true, result: 1 });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.getFavourites = async (req, res) => {
  try {
    const { NftId, WalletAddress } = req.body;
    Users.find({ WalletAddress: WalletAddress.toString().toLowerCase() })
      .then((resData) => {
        var resultData = resData[0]?.TokenId.filter((x) => {
          if (x == NftId) {
            return x;
          }
        });
        var owner =
          resultData == undefined
            ? false
            : resultData.length == 0
            ? false
            : true;

        Favourites.find({ NftId: NftId }).then((result) => {
          if (result.length > 0) {
            let wallet_address = result[0].WalletAddress;
            if (WalletAddress) {
              let checkdulplicate = wallet_address.filter(
                (e) => e == WalletAddress
              );

              if (checkdulplicate.length > 0) {
                return res.status(200).send({
                  success: true,
                  result: wallet_address.length,
                  alreadyLiked: true,
                  WalletAddress: wallet_address,
                  owner: owner,
                });
              } else {
                return res.status(200).send({
                  success: true,
                  result: wallet_address.length,
                  alreadyLiked: false,
                  owner: owner,
                });
              }
            } else {
              return res.status(200).send({
                success: true,
                result: wallet_address.length,
                alreadyLiked: false,
                owner: owner,
              });
            }
          } else {
            return res.status(200).send({
              success: true,
              result: 0,
              alreadyLiked: false,
              owner: owner,
            });
          }
        });
      })
      .catch((err) => {
        Favourites.find({ NftId: NftId }).then((result) => {
          if (result.length > 0) {
            let wallet_address = result[0].WalletAddress;
            if (WalletAddress) {
              let checkdulplicate = wallet_address.filter(
                (e) => e == WalletAddress
              );

              if (checkdulplicate.length > 0) {
                return res.status(200).send({
                  success: true,
                  result: wallet_address.length,
                  alreadyLiked: true,
                  WalletAddress: wallet_address,
                  owner: false,
                });
              } else {
                return res.status(200).send({
                  success: true,
                  result: wallet_address.length,
                  alreadyLiked: false,
                  owner: false,
                });
              }
            } else {
              return res.status(200).send({
                success: true,
                result: wallet_address.length,
                alreadyLiked: false,
                owner: false,
              });
            }
          } else {
            return res.status(200).send({
              success: true,
              result: 0,
              alreadyLiked: false,
              owner: false,
            });
          }
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};

exports.ExipredNft = async (req, res) => {
  let todaydate = new Date();
  try {
    NFT.find({
      $and: [{ AuctionEndDate: { $lt: todaydate } }, { Status: "Auction" }],
    }).then((data) => {
      return res.status(200).send({ status: false, result: data });
    });
  } catch (e) {
    console.log(e);
    return res.status(404).send({ status: false });
  }
};
exports.getFavouritesNFT = async (req, res) => {
  let todaydate = new Date();
  try {
    const sortBy = "WalletAddress";
    const orderBy = -1;
    var count = 0;
    let nftids = [];
    const questions = await Favourites.aggregate()
      .addFields({ length: { $size: `$${sortBy}` } }) //adds a new field, to the existing ones (incl. _id)
      .sort({ length: orderBy })
      .then((result) => {
        if (result.length > 0) {
          for (var i = 0; i < 8; i++) {
            if (result[i]?.NftId) {
              nftids.push(result[i]?.NftId);
            }
            count = count + 1;
          }
          if (count == 8) {
            NFT.find({ NftId: nftids }).then((result1) => {
              return res.status(200).send({ status: true, result: result1 });
            });
          }
        } else {
          return res.status(404).send({ status: false });
        }
      });
  } catch (e) {
    console.log(e);
    return res
      .status(404)
      .send({ status: false, message: "Something went wrong" });
  }
};
exports.TodayMintednft = async (req, res) => {
  let todaydate = new Date();
  const getenddate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate() + 1
  );

  NFT.find(
    { $and: [{ createdAt: getenddate }, { IsBlock: { $ne: true } }] },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send({ status: false });
      } else {
        if (result.length > 0) {
          return res.status(200).send({ status: true, result: result });
        } else {
          let getenddate = new Date(
            todaydate.getFullYear(),
            todaydate.getMonth(),
            todaydate.getDate() - 3
          );

          NFT.find(
            {
              $and: [
                { createdAt: { $gte: getenddate, $lte: todaydate } },
                { IsBlock: { $ne: true } },
              ],
            },
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(404).send({ status: false });
              } else {
                return res.status(200).send({ status: true, result: result });
              }
            }
          );
        }
      }
    }
  );
};

exports.Homesearch = async (req, res) => {
  try {
    let collection = await Colection.find({});
    let allnfts = await NFT.find({});
    let profiles = await Users.find({});
    return res.status(200).send({
      status: true,
      collection: collection,
      allnfts: allnfts,
      profiles: profiles,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ status: false });
  }
};

exports.Likednfts = async (req, res) => {
  try {
    let query = { WalletAddress: { $in: [req.body.address] } };

    let nftids = [];
    let allnftids = await Favourites.find({
      WalletAddress: { $in: [req.body.address] },
    }).then((data) => {
      if (data.length > 0) {
        data.map(async (e, i) => {
          nftids.push(e.NftId);
          if (i == data.length - 1) {
            let allnfts = await NFT.find({ NftId: nftids });
            return res.status(200).send({ status: true, result: allnfts });
          }
        });
      } else {
        return res.status(404).send({ status: false });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ status: false });
  }
};

exports.getActivity = async (req, res) => {
  const { WalletAddress } = req.body;
  let newAddress = WalletAddress.toLowerCase();
  let activity = await Activity.aggregate(
    [
      {
        $project: {
          _id: "$_id",
          WalletAddress: "$WalletAddress",
          TokenId: "$TokenId",
          Token: "$Token",
          Blockchain: "$Blockchain",
          from: "$from",
          to: "$to",
          Type: "$Type",
          price: "$price",
          quantity: "$quantity",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
      { $match: { WalletAddress: newAddress } },
      {
        $lookup: {
          from: "nft-collections",
          localField: "TokenId",
          foreignField: "NftId",
          as: "nftDetails",
        },
      },
      { $sort: { createdAt: -1 } },
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send({ status: false });
      } else {
        return res.status(200).send({ status: true, result: result });
      }
    }
  );
};
exports.getAllActivity = async (req, res) => {
  const { filter } = req.body;

  let date = new Date();
  var startDate = new Date();

  if (filter == "7") {
    startDate = startDate.setDate(startDate.getDate() - 7);
  } else if (filter == "14") {
    startDate = startDate.setDate(startDate.getDate() - 14);
  } else if (filter == "month") {
    startDate.setMonth(startDate.getMonth() - 1);
    startDate = startDate.setDate(
      startDate.getDate() - (startDate.getDate() - 1)
    );
  } else if ("year") {
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setMonth(startDate.getMonth() - startDate.getMonth());
    startDate.setDate(startDate.getDate() - startDate.getDate());
  }

  let activity = await Activity.aggregate(
    [
      {
        $project: {
          _id: "$_id",
          WalletAddress: "$WalletAddress",
          TokenId: "$TokenId",
          Token: "$Token",
          Blockchain: "$Blockchain",
          from: "$from",
          to: "$to",
          Type: "$Type",
          price: "$price",
          quantity: "$quantity",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: date,
          },
        },
      },

      {
        $lookup: {
          from: "nft-collections",
          localField: "TokenId",
          foreignField: "NftId",
          as: "nftDetails",
        },
      },
      { $sort: { createdAt: -1 } },
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send({ status: false });
      } else {
        return res.status(200).send({ status: true, result: result });
      }
    }
  );
};

exports.createActivity = async (req, res) => {
  const { WalletAddress, TokenId, Type, price, from, to, Blockchain } =
    req.body;
  try {
    Activity.create(req.body);
    return res.json({
      success: true,
      message: "Activity added successfully",
    });
  } catch (e) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.checkdublicate = async (req, res) => {
  const { Pinatahash } = req.body;
  console.log("dsdasdsa",Pinatahash);
  NFT.find({ Pinatahash: Pinatahash })
    .then((data) => {
      return res.status(200).send({ status: true, result: data,isDublicate:data?.length?true:false });
    })
    .catch((err) => {
      return res.status(404).send({ status: false });
    });
};
