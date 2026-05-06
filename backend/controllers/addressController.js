import Address from "../models/address.js";

// save address
export const handelSaveAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    res.status(201).json({ message: "Address saved succesfully", address });
  } catch (error) {
    res.status(500).json({ error: "Failed to save address" });
  }
};

// get saved addresses

export const handelGetSavedAddress = async (req, res) => {
  const userAddresses = await Address.find({ userId: req.params.userid });
  res.json(userAddresses);
};
