import request from "supertest";
import app from "../server";

describe("routes", () => {
  it("deve criar um novo usuário", async () => {
    const response = await request(app).get(
      "/create?email=emailTeste@gmail.com"
    );

    expect(response.status).toBe(200);
  });

  it("deve retornar erro ao criar usuario sem email", async () => {
    const response = await request(app).get("/create");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email is required");
  });

  it("deve retornar erro ao usar email que ja existe", async () => {
    const response = await request(app).get(
      "/create?email=emailTeste@gmail.com"
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email already used");
  });
  
});
