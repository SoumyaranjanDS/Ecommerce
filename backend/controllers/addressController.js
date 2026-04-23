const Address = require("../models/address");

// save address
const handelSaveAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    res.status(201).json({ message: "Address saved succesfully", address });
  } catch (error) {
    res.status(500).json({ error: "Failed to save address" });
  }
};

// get saved addresses

const handelGetSavedAddress = async (req, res) => {
  const userAddresses = await Address.find({ userid: req.params.userid });
  res.json(userAddresses);
};

module.exports = {
  handelSaveAddress,
  handelGetSavedAddress,
};
