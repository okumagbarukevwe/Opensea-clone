var mongoose = require('mongoose');

var addNftsSchema = new mongoose.Schema({
    name:String,
    nftNumber: Number,
    price: Number,
    likes: Number,
    ownedBy: String,
    image: String
    // created: {type: Date, default: date.toLocaleString('en-US')}
});

module.exports = mongoose.model('addNfts', addNftsSchema);