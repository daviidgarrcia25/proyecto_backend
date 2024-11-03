const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const GastoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  descripcion: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Gasto", GastoSchema);
