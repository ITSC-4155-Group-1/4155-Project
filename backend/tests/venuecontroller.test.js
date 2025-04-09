const request = require("supertest");

const BASE_URL = "http:localhost:3000";

describe("Venue Middleware Testing", () => {
    const agent = request.agent(BASE_URL);
    let testVenueId = "";

    beforeAll(async () => {
        // Log in before running tests
        const loginResponse = await agent.post("/user/login").send({
            email: "littleguy3@gmail.com",
            password: "$jy6$z*B}xWLGcH",
        });
        expect(loginResponse.status).toBe(200);
    });

    test("GET /venue should return all venues", async () => {
        const response = await agent.get("/venue");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    test("POST /venue should create a venue", async () => {
      const response = await agent.post("/venue")
          .field("venueName", "Test Venue")
          .field("description", "A great test venue")
          .field("host", "65123abcde4567890f123461")
          .field("state", "Test State")
          .field("city", "Test City")
          .field("address", "123 Test St")
          .field("price", "100") 
          .field("availability[]", "2025-05-01T00:00:00.000Z")
          .field("availability[]", "2025-07-01T00:00:00.000Z")
          .field("capacity", "200")
          .attach("images", "./tests/fancy-test-venue.jpg");
  
      console.log("Response:", response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", "Venue created successfully");
  });
  
  

    
});


  
//   const venueSchema = new Schema({
//     venueName: {type: String, required: [true, 'Venue name is required']},
//     description: {type: String, required: [true, 'Venue description is required']},
//     host: {type: Schema.Types.ObjectID, ref: 'User'},
//     state: {type: String, required: [true, 'Venue location is required']},
//     city: {type: String, required: [true, 'Venue location is required']},
//     address: {type: String, required: [true, 'Venue location is required']},
//     price: {type: Number, required: [true, 'Venue price is required'], minValue: [0.01, 'Price must be at least $0.01']},
//     availability: [{type: Date, required: [true, 'Venue availability is required']}],
//     capacity: {type: Number, required: [true, 'Venue Capacity is required']},
//     images: [{type: String, required: [true, 'Image is required']}],
//     ratingAvg: {type: Number},
//     numRatings: {type: Number, default: 0}
// })
  
  