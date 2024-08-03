const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Project API", () => {
  let token;

  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "testpassword",
      });

      if (res.statusCode !== 200) {
        throw new Error(
          `Login failed with status ${res.statusCode}: ${res.body.message}`
        );
      }

      token = res.body.token;
      if (!token) {
        throw new Error("Token is missing in the login response");
      }
    } catch (error) {
      console.error("Setup failed:", error.message);
      throw error;
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Project",
        description: "Test Description",
      });

    console.log("Create project response:", res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("should fetch projects with pagination", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .query({ page: 1, limit: 10 });

    console.log("Fetch projects response:", res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("projects");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage");
  });
});
