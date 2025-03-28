const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

let server;
const url = "mongodb+srv://gatherlyAdmin:Es7eW3Wno1MA17rb@gatherly.oorgz.mongodb.net/Gatherly_Data";



// Test Server \._./
beforeAll(async () => {
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  server = app.listen(4000, () => {
    console.log("Test server running on port 4000");
  });
});


afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});


// DESCRIBE \._./
describe("User Middleware testing", () => {
  const randomString = Math.random().toString(36).substring(2, 15); 
  const email = `${randomString}@example.com`; 
  test("POST /user/signup should allow valid input", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        firstName: "Jane",
        lastName: "Doe",
        email: email,
        password: "securepassword",
      });
  
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe("Account created successfully, please login");
  });



  test("POST /user/signup should require all fields", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        firstName: "Jane",
        lastName: "Doe",
        email: "", 
        password: "securepassword",
      });
  


    console.log("Signup Missing Fields Response:", response.body);
    expect(response.status).toBe(400);    
  });


  test("POST /user/signup should not allow duplicate emails", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        firstName: "Jane",
        lastName: "Doe",
        email: email,
        password: "securepassword",
      });
  
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.invalid).toBe("Email is already in use");
  });

  test("POST /user/signup should require a password", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        firstName: "Jane",
        lastName: "Doe",
        email: email,
        password: "",
      });
  
    console.log(response.body);
    expect(response.status).toBe(400);
  });


  test("POST /user/login should reject invalid email", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: "nonexistent@example.com",
        password: "securepassword",
      });
  
    console.log("Invalid Email Response:", response.body);
    expect(response.status).toBe(400);
    expect(response.body.invalid).toBe("Invalid email. Please try another one.");
  });
  
  test("POST /user/login should reject incorrect password", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: email,
        password: "nuh-uh",
      });
  
    console.log("Incorrect Password Response:", response.body);
    expect(response.status).toBe(400);
    expect(response.body.invalid[0]).toBe("A password of length 8 to 30 is required");
  });

  test("POST /user/login should create a session token", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: email,
        password: "securepassword",
      });


    console.log("Login Response Body:", response.body);
    expect(response.body.success).toBe("Login successful");
    expect(response.body.token).toBeDefined();
    expect(response.body.token.user).toBeDefined(); 
  });


  test("POST /user/logout should destroy session", async () => {
    // maintains session
    const agent = request.agent(app);

    await agent.post("/user/login").send({
      email: email,
      password: "securepassword",
    });

    const response = await agent.get("/user/logout");
    console.log("Logout Response Body:", response.body); 
    expect(response.body.success).toBe("Successfully logged out of session");
  });


  test("GET /user/logout should return an error when not logged in", async () => {
    const response = await request(app).get("/user/logout");


    console.log("Logout Without Login Response:", response.body);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Unauthorized: You must be logged in to perform this action.");
  });
  
});



