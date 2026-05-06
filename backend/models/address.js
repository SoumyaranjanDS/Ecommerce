import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fullname: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
  },
  { timestamps: true },
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
