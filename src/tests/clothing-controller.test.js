import request from "supertest";
import express from "express";
import clothingRouter from "../routes/clothing-route.js";
import * as clothingRepository from "../repository/clothing-repository.js";

const app = express();
app.use(express.json());
app.use("/clothing", clothingRouter);

jest.mock("../repository/clothing-repository.js");

describe("Clothing Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch all clothing items", async () => {
    const mockClothing = [{ id: "1", name: "T-Shirt" }];
    clothingRepository.getAllClothing.mockResolvedValue(mockClothing);

    const response = await request(app).get("/clothing");

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe("Fetching all clothing successfully.");
  });

  test("should add new clothing item", async () => {
    const newClothingData = { name: "Hoodie", color: "Red", size: "M" };
    const mockNewClothing = { id: "2", ...newClothingData };
    clothingRepository.addClothing.mockResolvedValue(mockNewClothing);

    const response = await request(app).post("/clothing").send(newClothingData);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(201);
    expect(response.body.data).toEqual(mockNewClothing);
    expect(response.body.message).toBe("Clothing added successfully.");
  });

  test("should search clothing by color", async () => {
    const mockClothing = [{ id: "1", color: "Blue" }];
    clothingRepository.findClothingByColor.mockResolvedValue(mockClothing);

    const response = await request(app)
      .get("/clothing/search/color")
      .query({ color: "Blue" });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe("Clothing search by color successful.");
  });

  test("should return 400 if color query is missing", async () => {
    const response = await request(app).get("/clothing/search/color");

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe(
      "Warning `color` query parameter is required."
    );
  });

  test("should search clothing by size", async () => {
    const mockClothing = [{ id: "1", size: "L" }];
    clothingRepository.findClothingBySize.mockResolvedValue(mockClothing);

    const response = await request(app)
      .get("/clothing/search/size")
      .query({ size: "L" });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe("Clothing search by size successful.");
  });

  test("should return 400 if size query is missing", async () => {
    const response = await request(app).get("/clothing/search/size");

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe(
      "Warning `size` query parameter is required."
    );
  });

  test("should search clothing by search query", async () => {
    const mockClothing = [
      { id: "1", name: "T-Shirt", color: "Blue", size: "L" },
    ];
    clothingRepository.findClothingLikeBySizeOrColor.mockResolvedValue(
      mockClothing
    );

    const response = await request(app)
      .get("/clothing/search")
      .query({ search: "T-Shirt" });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe("Clothing search successful.");
  });

  test("should increase stock successfully", async () => {
    const mockUpdatedClothing = { id: "1", stock: 20 };
    clothingRepository.increaseStock.mockResolvedValue(mockUpdatedClothing);

    const response = await request(app)
      .patch("/clothing/increase-stock")
      .send({ id: "1", quantity: 10 });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockUpdatedClothing);
    expect(response.body.message).toBe("Stock increased successfully.");
  });

  test("should decrease stock successfully", async () => {
    const mockClothing = { id: "1", stock: 20 };
    clothingRepository.getClothingById.mockResolvedValue(mockClothing);
    clothingRepository.decreaseStock.mockResolvedValue({
      ...mockClothing,
      stock: 10,
    });

    const response = await request(app)
      .patch("/clothing/decrease-stock")
      .send({ id: "1", quantity: 10 });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual({ ...mockClothing, stock: 10 });
    expect(response.body.message).toBe("Stock decreased successfully.");
  });

  test("should return 400 if insufficient stock when decreasing", async () => {
    const mockClothing = { id: "1", stock: 5 };
    clothingRepository.getClothingById.mockResolvedValue(mockClothing);

    const response = await request(app)
      .patch("/clothing/decrease-stock")
      .send({ id: "1", quantity: 10 });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe("Insufficient stock");
  });

  test("should get all available clothing", async () => {
    const mockClothing = [{ id: "1", stock: 10 }];
    clothingRepository.getAllAvailableClothing.mockResolvedValue(mockClothing);

    const response = await request(app).get("/clothing/available");

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe(
      "Fetching all available clothing successfully."
    );
  });

  test("should get out-of-stock clothing", async () => {
    const mockClothing = [{ id: "1", stock: 0 }];
    clothingRepository.getOutOfStockClothing.mockResolvedValue(mockClothing);

    const response = await request(app).get("/clothing/out-of-stock");

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe(
      "Fetching out-of-stock clothing successfully."
    );
  });

  test("should get low-stock clothing", async () => {
    const mockClothing = [{ id: "1", stock: 3 }];
    clothingRepository.getLowStockClothing.mockResolvedValue(mockClothing);

    const response = await request(app).get("/clothing/low-stock");

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe(
      "Fetching low-stock clothing successfully."
    );
  });

  test("should get clothing by ID", async () => {
    const mockClothing = { id: "1", name: "T-Shirt" };
    clothingRepository.getClothingById.mockResolvedValue(mockClothing);

    const response = await request(app).get("/clothing/1");

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe("Fetching clothing by ID successful.");
  });

  test("should return 404 if clothing by ID not found", async () => {
    clothingRepository.getClothingById.mockResolvedValue(null);

    const response = await request(app).get("/clothing/1");

    expect(response.status).toBe(404);
    expect(response.body.code).toBe(404);
    expect(response.body.message).toBe("Clothing not found");
  });

  test("should update clothing", async () => {
    const updatedData = { name: "Updated T-Shirt" };
    const mockUpdatedClothing = { id: "1", ...updatedData };
    clothingRepository.updateClothing.mockResolvedValue(mockUpdatedClothing);

    const response = await request(app).put("/clothing/1").send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockUpdatedClothing);
    expect(response.body.message).toBe("Clothing updated successfully.");
  });

  test("should return 404 if update clothing not found", async () => {
    clothingRepository.updateClothing.mockResolvedValue(null);

    const response = await request(app)
      .put("/clothing/1")
      .send({ name: "Updated T-Shirt" });

    expect(response.status).toBe(404);
    expect(response.body.code).toBe(404);
    expect(response.body.message).toBe("Clothing not found");
  });

  test("should delete clothing", async () => {
    clothingRepository.deleteClothing.mockResolvedValue(true);

    const response = await request(app).delete("/clothing/1");

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe("Clothing deleted successfully.");
  });

  test("should return 404 if delete clothing not found", async () => {
    clothingRepository.deleteClothing.mockResolvedValue(false);

    const response = await request(app).delete("/clothing/1");

    expect(response.status).toBe(404);
    expect(response.body.code).toBe(404);
    expect(response.body.message).toBe("Clothing not found");
  });
});
