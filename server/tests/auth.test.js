const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Authentication API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should log in a user and return a token", async () => {
    try {
      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "testpassword",
      });

      if (res.statusCode !== 200) {
        throw new Error(`Login failed with status ${res.statusCode}`);
      }

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  });
});
