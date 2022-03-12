const mongoose = require("../database");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  cpf: {
    type: String,
    unique: true,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
    /* pra quando buscar os users nao trazer no array essa info dos usuarios */
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
