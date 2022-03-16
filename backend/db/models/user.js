const mongoose = require("../index");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // require: true,
  },
  cpf: {
    type: String,
    unique: true,
    required: true,
  },
  date: {
    type: Date,
    // required: true,
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

function validaCpf(strCPF) {
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;

  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(10, 11))) return false;

  return true;
}

UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  let err = undefined;

  if (!validaCpf(this.cpf)) err = new Error("CPF inválido.");

  next(err);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
