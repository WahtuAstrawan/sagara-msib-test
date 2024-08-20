import { Clothing } from "../models/clothing-model.js";

export const getAllClothing = async () => {
  return await Clothing.find({});
};

export const addClothing = async (clothingData) => {
  const clothing = new Clothing(clothingData);
  return await clothing.save();
};

export const findClothingByColor = async (color) => {
  return await Clothing.find({
    color: color,
  });
};

export const findClothingBySize = async (size) => {
  return await Clothing.find({
    size: size,
  });
};

export const findClothingLikeBySizeOrColor = async (search) => {
  return await Clothing.find({
    $or: [
      { color: { $regex: new RegExp(search, "i") } },
      { size: { $regex: new RegExp(search, "i") } },
    ],
  });
};

export const increaseStock = async (id, quantity) => {
  return await Clothing.findByIdAndUpdate(
    id,
    { $inc: { stock: quantity } },
    { new: true }
  );
};

export const decreaseStock = async (id, quantity) => {
  return await Clothing.findByIdAndUpdate(
    id,
    { $inc: { stock: -quantity } },
    { new: true }
  );
};

export const getAllAvailableClothing = async () => {
  return await Clothing.find({ stock: { $gt: 0 } });
};

export const getOutOfStockClothing = async () => {
  return await Clothing.find({ stock: { $lte: 0 } });
};

export const getLowStockClothing = async () => {
  return await Clothing.find({ stock: { $lt: 5 } });
};

export const getClothingById = async (id) => {
  return await Clothing.findById(id);
};

export const updateClothing = async (id, clothingData) => {
  return await Clothing.findByIdAndUpdate(id, clothingData, { new: true });
};

export const deleteClothing = async (id) => {
  return await Clothing.findByIdAndDelete(id);
};
