const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    isForSale: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    collectionType: {
      type: String,
      enum: ["coolstuff", "weirdstuff", "patata"]
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Nft = mongoose.model("Nft", nftSchema);

module.exports = Nft;
