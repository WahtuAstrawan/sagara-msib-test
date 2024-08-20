import * as clothingRepository from "../repository/clothing-repository.js";

export const getAllClothing = async (req, res) => {
  try {
    const clothing = await clothingRepository.getAllClothing();
    return res.status(200).json({
      code: 200,
      data: clothing,
      message: "Fetching all clothing successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addClothing = async (req, res) => {
  try {
    const clothingData = req.body;
    const newClothing = await clothingRepository.addClothing(clothingData);
    return res.status(201).json({
      code: 201,
      data: newClothing,
      message: "Clothing added successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const findClothingByColor = async (req, res) => {
  try {
    const { color } = req.query;

    if (!color) {
      return res.status(400).json({
        code: 400,
        message: "Warning `color` query parameter is required.",
      });
    }

    const clothing = await clothingRepository.findClothingByColor(color);

    return res.status(200).json({
      code: 200,
      data: clothing,
      message: "Clothing search by color successful.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const findClothingBySize = async (req, res) => {
  try {
    const { size } = req.query;

    if (!size) {
      return res.status(400).json({
        code: 400,
        message: "Warning `size` query parameter is required.",
      });
    }

    const clothing = await clothingRepository.findClothingBySize(size);

    return res.status(200).json({
      code: 200,
      data: clothing,
      message: "Clothing search by size successful.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const searchClothing = async (req, res) => {
  try {
    const { search } = req.query;
    const searchQuery = search || "";

    const clothing = await clothingRepository.findClothingLikeBySizeOrColor(
      searchQuery
    );

    return res.status(200).json({
      code: 200,
      data: clothing,
      message: "Clothing search successful.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const increaseStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const updatedClothing = await clothingRepository.increaseStock(
      id,
      quantity
    );
    return res.status(200).json({
      code: 200,
      data: updatedClothing,
      message: "Stock increased successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const decreaseStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;

    const clothing = await clothingRepository.getClothingById(id);

    if (!clothing) {
      return res.status(404).json({
        code: 404,
        message: "Clothing not found",
      });
    }

    if (clothing.stock < quantity) {
      return res.status(400).json({
        code: 400,
        message: "Insufficient stock",
      });
    }

    const updatedClothing = await clothingRepository.decreaseStock(
      id,
      quantity
    );
    return res.status(200).json({
      code: 200,
      data: updatedClothing,
      message: "Stock decreased successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllAvailableClothing = async (req, res) => {
  try {
    const clothing = await clothingRepository.getAllAvailableClothing();
    return res.status(200).json({
      code: 200,
      data: clothing,
      message: "Fetching all available clothing successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getOutOfStockClothing = async (req, res) => {
  try {
    const clothing = await clothingRepository.getOutOfStockClothing();
    return res.status(200).json({
      code: 200,
      data: clothing,
      message: "Fetching out-of-stock clothing successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getLowStockClothing = async (req, res) => {
  try {
    const clothing = await clothingRepository.getLowStockClothing();
    return res.status(200).json({
      code: 200,
      data: clothing,
      message: "Fetching low-stock clothing successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getClothingById = async (req, res) => {
  try {
    const { id } = req.params;
    const clothing = await clothingRepository.getClothingById(id);
    if (clothing) {
      return res.status(200).json({
        code: 200,
        data: clothing,
        message: "Fetching clothing by ID successful.",
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "Clothing not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateClothing = async (req, res) => {
  try {
    const { id } = req.params;
    const clothingData = req.body;
    const updatedClothing = await clothingRepository.updateClothing(
      id,
      clothingData
    );
    if (updatedClothing) {
      return res.status(200).json({
        code: 200,
        data: updatedClothing,
        message: "Clothing updated successfully.",
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "Clothing not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteClothing = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClothing = await clothingRepository.deleteClothing(id);
    if (deletedClothing) {
      return res.status(200).json({
        code: 200,
        message: "Clothing deleted successfully.",
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "Clothing not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
