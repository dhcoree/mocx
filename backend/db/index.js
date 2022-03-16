var config = require("../config");

const mongoose = require("mongoose");

mongoose.connect(config.MONGO_URL);

mongoose.Promise = global.Promise;

module.exports = mongoose;
