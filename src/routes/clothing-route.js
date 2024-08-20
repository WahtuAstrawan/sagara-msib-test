import express from "express";
import * as clothingController from "../controllers/clothing-controller.js";

const clothingRouter = express.Router();

clothingRouter.get("/", clothingController.getAllClothing);
clothingRouter.post("/", clothingController.addClothing);
clothingRouter.get("/search", clothingController.searchClothing);
clothingRouter.get("/search/color", clothingController.findClothingByColor);
clothingRouter.get("/search/size", clothingController.findClothingBySize);
clothingRouter.patch("/increase-stock", clothingController.increaseStock);
clothingRouter.patch("/decrease-stock", clothingController.decreaseStock);
clothingRouter.get("/available", clothingController.getAllAvailableClothing);
clothingRouter.get("/out-of-stock", clothingController.getOutOfStockClothing);
clothingRouter.get("/low-stock", clothingController.getLowStockClothing);
clothingRouter.get("/:id", clothingController.getClothingById);
clothingRouter.put("/:id", clothingController.updateClothing);
clothingRouter.delete("/:id", clothingController.deleteClothing);

export default clothingRouter;
