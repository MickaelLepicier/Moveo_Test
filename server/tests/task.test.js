const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Task API", () => {
  let token;
  let projectId;

  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const authRes = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "testpassword",
      });

      if (authRes.statusCode !== 200) {
        throw new Error(`Login failed with status ${authRes.statusCode}`);
      }

      token = authRes.body.token;

      if (!token) {
        throw new Error("Token is missing in the login response");
      }

      const projectRes = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Project",
          description: "Test Description",
        });

      if (projectRes.statusCode !== 201) {
        throw new Error(
          `Project creation failed with status ${projectRes.statusCode}`
        );
      }

      projectId = projectRes.body._id;

      if (!projectId) {
        throw new Error(
          "Project ID is missing in the project creation response"
        );
      }
    } catch (error) {
      console.error("Setup failed:", error.message);
      throw error;
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Test Task Description",
        status: "todo",
        projectId,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("should fetch tasks with pagination", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .query({ page: 1, limit: 10 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("tasks");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage");
  });
});
