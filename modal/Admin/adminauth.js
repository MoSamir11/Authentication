const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: null,
  },
  email: {
    type: String,
    required: true,
    default: null,
  },
  password: {
    type: String,
    required: true,
    default: null,
  },
  userType: {
    type: String,
    required: true,
    default: null,
  },
});

module.exports = mongoose.model("adminauth", adminSchema);
