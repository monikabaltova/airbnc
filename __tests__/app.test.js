const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");

beforeEach(() => {
  return seed();
});
afterAll(() => {
  db.end();
});

describe("app", () => {
  test("request to invalid endpoint responds with 404 and a msg", async () => {
    const { body } = await request(app).get("/invalid-path").expect(404);
    expect(body.msg).toBe("Path not found.");
  });
  describe("GET - /api/properties", () => {
    test("a get request to /api/properties returns with status of 200", async () => {
      await request(app).get("/api/properties").expect(200);
    });
    test("a get request to /api/properties responds with an object with an array with key:properties, that contains property_id, property_name, location, price_per_night and host", async () => {
      const { body } = await request(app).get("/api/properties");

      expect(Array.isArray(body.properties)).toBe(true);
      expect(body.properties.length > 0).toBe(true);

      body.properties.forEach((property) => {
        expect(property.hasOwnProperty("property_id")).toBe(true);
        expect(property.hasOwnProperty("property_name")).toBe(true);
        expect(property.hasOwnProperty("location")).toBe(true);
        expect(property.hasOwnProperty("price_per_night")).toBe(true);
        expect(property.hasOwnProperty("host")).toBe(true);
      });
    });
    test("return first image associated with each property", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body.properties[0].image).toBe(
        "https://example.com/images/cosy_family_house_1.jpg"
      );
      expect(body.properties[6].image).toBe(
        "https://example.com/images/modern_apartment_1.jpg"
      );
    });
    describe("Queries for GET - /api/properties", () => {
      describe("sort - querie", () => {
        test("proprerties are sorted by defult from most favourited to least", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=popularity"
          );
          expect(body.properties).toBeSortedBy("popularity", {
            coerce: true,
            descending: true,
          });
        });
        test("should return properties sorted by price_per_night when passed as query", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
            descending: true,
          });
        });
      });
      describe("order - querie", () => {
        test("should return properties ordered DESC by default", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
            descending: true,
          });
        });

        test("should return properties ordered ASC when sort is set to asc", async () => {
          const { body } = await request(app).get(
            "/api/properties?sort=price_per_night&order=asc"
          );
          expect(body.properties).toBeSortedBy("price_per_night", {
            coerce: true,
            descending: false,
          });
        });
      });
      describe("max_price - querie", () => {
        test("should return properties with maximum price limit", async () => {
          const { body } = await request(app).get(
            "/api/properties?max_price=100"
          );
          body.properties.forEach((property) => {
            expect(property.price_per_night <= 100).toBe(true);
          });
        });
        test("returns 400 and msg if max_price query in NaN", async () => {
          const { body } = await request(app)
            .get("/api/properties?max_price=notAnumber")
            .expect(400);

          expect(body.msg).toBe("Bad request: invalid data");
        });
      });
      describe("min_price - querie", () => {
        test("should return properties with minimum price limit", async () => {
          const { body } = await request(app).get(
            "/api/properties?min_price=100"
          );
          body.properties.forEach((property) => {
            expect(property.price_per_night >= 100).toBe(true);
          });
        });
        test("returns 400 and msg if min_price query in NaN", async () => {
          const { body } = await request(app)
            .get("/api/properties?max_price=notAnumber")
            .expect(400);

          expect(body.msg).toBe("Bad request: invalid data");
        });
      });
      describe("property_type - querie", () => {
        test("returns only properties with matching property type", async () => {
          const { body } = await request(app).get(
            "/api/properties?property_type=house"
          );
          const resultIds = body.properties.map(
            ({ property_id }) => property_id
          );
          expect(resultIds.length).toBe(3);
          expect(resultIds).toEqual(expect.arrayContaining([2, 7, 10]));
        });
      });
      describe("host_id", () => {
        test("?host_id returns only the properties with matching host id", async () => {
          const { body } = await request(app)
            .get("/api/properties?host_id=1")
            .expect(200);
          body.properties.forEach((property) => {
            expect(property.host).toBe("Alice Johnson");
          });
        });
      });
    });
  });
  describe("GET - /api/properties/:id", () => {
    test("a get request to /api/properties/:id returns with status of 200", async () => {
      await request(app).get("/api/properties/6").expect(200);
    });

    test("get request to /api/properties/:id returns one property with matching property_id", async () => {
      const { body } = await request(app).get("/api/properties/3");
      expect(body.property.property_id).toBe(3);
    });
    test("get request to /api/properties/:id returns an object with an array with key: property that contains properties, property_id, property_name, location, price_per_night, description, host, host_avatar, favourite_count and images", async () => {
      const { body } = await request(app).get("/api/properties/3");
      const property = body.property;
      expect(property.hasOwnProperty("property_id")).toBe(true);
      expect(property.hasOwnProperty("property_name")).toBe(true);
      expect(property.hasOwnProperty("location")).toBe(true);
      expect(property.hasOwnProperty("price_per_night")).toBe(true);
      expect(property.hasOwnProperty("description")).toBe(true);
      expect(property.hasOwnProperty("host")).toBe(true);
      expect(property.hasOwnProperty("host_avatar")).toBe(true);
      expect(property.hasOwnProperty("favourite_count")).toBe(true);
      expect(property.hasOwnProperty("images")).toBe(true);
    });

    test("returned images property needs to be array containing all img for the selected property", async () => {
      const { body } = await request(app).get("/api/properties/1");
      expect(Array.isArray(body.property.images)).toBe(true);
      expect(body.property.images.length).toBe(2);
    });
  });
  describe("GET - /api/users/:id", () => {
    test(`get request to /api/users/:id returns status 200`, async () => {
      await request(app).get("/api/users/1").expect(200);
    });
    test("get request to /api/users/:id returns user object with properties: user_id, first_name, surname, email, phone_number, avatar, created_at", async () => {
      const { body } = await request(app).get("/api/users/1");
      const user = body.user;

      expect(user.hasOwnProperty("user_id")).toBe(true);
      expect(user.hasOwnProperty("first_name")).toBe(true);
      expect(user.hasOwnProperty("surname")).toBe(true);
      expect(user.hasOwnProperty("email")).toBe(true);
      expect(user.hasOwnProperty("phone_number")).toBe(true);
      expect(user.hasOwnProperty("avatar")).toBe(true);
      expect(user.hasOwnProperty("created_at")).toBe(true);
    });
    test("returns 404 and msg when passed a user with id which does not exist", async () => {
      const { body } = await request(app).get("/api/users/90000").expect(404);
      expect(body.msg).toBe("User not found");
    });
    test("returns 400 and msg when passed invalid data type", async () => {
      const { body } = await request(app)
        .get("/api/users/not-a-number")
        .expect(400);
      expect(body.msg).toBe("Bad request");
    });
  });
  describe("GET - /api/properties/:id/reviews", () => {
    test("get request to /api/properties/:id/reviews returns status 200", async () => {
      await request(app).get("/api/properties/1/reviews").expect(200);
    });
    test("get request to /api/users/:id returns user object with kay reviews containing array of reviews related to the selected property should have: property id, each with keys: review_id, comment, rating, created_at, guest, guest_avatar", async () => {
      const { body } = await request(app)
        .get("/api/properties/1/reviews")
        .expect(200);
      expect(body.reviews.length).toBe(3);
      body.reviews.forEach((review) => {
        expect(review.hasOwnProperty("review_id")).toBe(true);
        expect(review.hasOwnProperty("comment")).toBe(true);
        expect(review.hasOwnProperty("rating")).toBe(true);
        expect(review.hasOwnProperty("created_at")).toBe(true);
        expect(review.hasOwnProperty("guest")).toBe(true);
        expect(review.hasOwnProperty("guest_avatar")).toBe(true);
      });
    });
    test("returns 404 and msg when passed an property id which does not exist", async () => {
      const { body } = await request(app)
        .get("/api/properties/2000/reviews")
        .expect(404);
      expect(body.msg).toBe("This property has no reviews !");
    });
    test("returns 400 and msg when passed invalid data type", async () => {
      const { body } = await request(app)
        .get("/api/properties/not-a-number/reviews")
        .expect(400);
      expect(body.msg).toBe("Bad request");
    });
  });
  describe("POST - /api/properties/:id/reviews", () => {
    test("post request to /api/properties/:id/reviews : adds new review", async () => {
      await request(app)
        .post("/api/properties/1/reviews")
        .send({
          guest_id: 4,
          rating: 5,
          comment: "Lovely place! I'd definitely recommend it.",
        })
        .expect(201);
      const { body } = await request(app).get("/api/properties/1/reviews");
      expect(body.reviews.length).toBe(4);
    });
    test("post to /api/properties/:id/reviews returns inserted review with keys: review_id, property_id, guest_id, rating, comment, created_at", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send({
          guest_id: 4,
          rating: 5,
          comment: "Lovely place! I'd definitely recommend it.",
        });
      const { review } = body;
      expect(review.review_id).toBe(17);
      expect(review.property_id).toBe(1);
      expect(review.guest_id).toBe(4);
      expect(review.rating).toBe(5);
      expect(review.comment).toBe("Lovely place! I'd definitely recommend it.");
      expect(review.hasOwnProperty("created_at")).toBe(true);
    });

    test("returns 400 and msg when payload contains an invalid data type", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send({
          guest_id: "text",
          rating: "5",
          comment: "Not gonna pass!",
        })
        .expect(400);
      expect(body.msg).toBe("Bad request: Invalid data type");
    });
  });
  describe("DELETE - /api/reviews/:id", () => {
    test(" delete request to /api/reviews/:id returns status code 204 and deletes review ", async () => {
      await request(app).delete("/api/reviews/1").expect(204);

      const { rowCount } = await db.query("SELECT * FROM reviews;");

      expect(rowCount).toBe(15);
    });

    test(`returns with 400 and msg if review_id param is not a number`, async () => {
      const { body } = await request(app)
        .delete("/api/reviews/notanumber")
        .expect(400);

      expect(body.msg).toBe("Bad request");
    });
    test(`returns with 404 and msg if path structure valid but review_id not in db`, async () => {
      const { body } = await request(app)
        .delete("/api/reviews/1000")
        .expect(404);

      expect(body.msg).toBe("Data not found.");
    });
  });
});
