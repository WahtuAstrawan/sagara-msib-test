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
    const mockClothing = [
      { id: "1", color: "Red", size: "M", price: 20, stock: 10 },
    ];
    clothingRepository.getAllClothing.mockResolvedValue(mockClothing);

    const response = await request(app).get("/clothing");

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual(mockClothing);
    expect(response.body.message).toBe("Fetching all clothing successfully.");
  });

  test("should add new clothing item", async () => {
    const newClothingData = { color: "Red", size: "M", price: 20, stock: 10 };
    const mockNewClothing = { id: "2", ...newClothingData };
    clothingRepository.addClothing.mockResolvedValue(mockNewClothing);

    const response = await request(app).post("/clothing").send(newClothingData);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(201);
    expect(response.body.data).toEqual(mockNewClothing);
    expect(response.body.message).toBe("Clothing added successfully.");
  });

  test("should search clothing by color", async () => {
    const mockClothing = [
      { id: "1", color: "Blue", size: "L", price: 25, stock: 5 },
    ];
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
      "Bad Request: `color` query parameter is required."
    );
  });

  test("should search clothing by size", async () => {
    const mockClothing = [
      { id: "1", color: "Green", size: "L", price: 30, stock: 3 },
    ];
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
      "Bad Request: `size` query parameter is required."
    );
  });

  test("should search clothing by search query", async () => {
    const mockClothing = [
      {
        id: "1",
        color: "Blue",
        size: "L",
        price: 25,
        stock: 5,
      },
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
    const mockUpdatedClothing = {
      id: "1",
      color: "Red",
      size: "M",
      price: 20,
      stock: 20,
    };
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
    const mockClothing = {
      id: "1",
      color: "Red",
      size: "M",
      price: 20,
      stock: 20,
    };
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
    const mockClothing = {
      id: "1",
      color: "Red",
      size: "M",
      price: 20,
      stock: 5,
    };
    clothingRepository.getClothingById.mockResolvedValue(mockClothing);

    const response = await request(app)
      .patch("/clothing/decrease-stock")
      .send({ id: "1", quantity: 10 });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe("Insufficient stock");
  });

  test("should get all available clothing", async () => {
    const mockClothing = [
      { id: "1", color: "Red", size: "M", price: 20, stock: 10 },
    ];
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
    const mockClothing = [
      { id: "1", color: "Black", size: "S", price: 15, stock: 0 },
    ];
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
    const mockClothing = [
      { id: "1", color: "Green", size: "L", price: 25, stock: 3 },
    ];
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
    const mockClothing = {
      id: "1",
      color: "Blue",
      size: "M",
      price: 30,
      stock: 10,
    };
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
    const updatedData = { color: "Updated Red", price: 22 };
    const mockUpdatedClothing = {
      id: "1",
      ...updatedData,
      size: "M",
      stock: 10,
    };
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
      .send({ color: "Updated Red" });

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
