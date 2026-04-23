const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fullname: String,
    phone: String,
    adressLine: String,
    city: String,
    state: String,
    pincode: String,
  },
  { timestamps: true },
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
