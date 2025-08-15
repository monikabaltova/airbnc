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
          const { body } = await request(app)
            .get("/api/properties?max_price=100")
            .expect(200);
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
        test("returns 200 with a msg : properties not found / when the input is valid but there is no properties in this range", async () => {
          const { body } = await request(app)
            .get("/api/properties?max_price=5")
            .expect(200);

          expect(body.msg).toBe("There is no properties avaliable");
        });
      });

      describe("min_price - querie", () => {
        test("should return properties with minimum price limit", async () => {
          const { body } = await request(app)
            .get("/api/properties?min_price=100")
            .expect(200);
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
        test("returns 200 with a msg : properties not found / when the input is valid but there is no properties in this range", async () => {
          const { body } = await request(app)
            .get("/api/properties?max_price=5")
            .expect(200);

          expect(body.msg).toBe("There is no properties avaliable");
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
        test("returns status 200 when the selected property type does not exist or there are no properties listed", async () => {
          const { body } = await request(app)
            .get("/api/properties?property_type=garage")
            .expect(200);

          expect(body.msg).toBe("There is no properties avaliable");
        });
        test.only("returns status 404 and msg when passed a property type which does not exist", async () => {
          const { body } = await request(app)
            .get("/api/properties?property_type=non-existent-property-type")
            .expect(404);

          expect(body.msg).toBe("Property type does not exist");
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
        test("returns 400 when host id is invalid input data", async () => {
          const { body } = await request(app)
            .get("/api/properties?host_id=not-a-number")
            .expect(400);
          expect(body.msg).toBe("Bad request: invalid data");
        });
        test("returns 200 when host id valid and exists but no properties avaliable", async () => {
          const { body } = await request(app)
            .get("/api/properties?host_id=2")
            .expect(200);
          expect(body.msg).toBe("This user currently has no properties");
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
      const expected = {
        property_id: 3,
        property_name: "Chic Studio Near the Beach",
        location: "Brighton, UK",
        price_per_night: 90,
        description: "Description of Chic Studio Near the Beach.",
        host: "Alice Johnson",
        host_avatar: "https://example.com/images/alice.jpg",
        favourite_count: "1",
        images: ["https://example.com/images/chic_studio_1.jpg"],
      };
      expect(body.property).toEqual(expected);
    });

    test("returned images property needs to be array containing all img for the selected property", async () => {
      const { body } = await request(app).get("/api/properties/1");
      expect(Array.isArray(body.property.images)).toBe(true);
      expect(body.property.images.length).toBe(2);
    });

    test("returns 404 when id is valid data type, but is not existing in the DB ", async () => {
      const { body } = await request(app)
        .get("/api/properties/1000")
        .expect(404);
      expect(body.msg).toBe("Property not found");
    });
    test("returns 400 and msg when passed invalid data type", async () => {
      const { body } = await request(app)
        .get("/api/properties/not-a-number")
        .expect(400);
      expect(body.msg).toBe("Bad request: invalid data");
    });
  });
  describe("GET - /api/users/:id", () => {
    test(`get request to /api/users/:id returns status 200`, async () => {
      await request(app).get("/api/users/1").expect(200);
    });
    test("get request to /api/users/:id returns user object with properties: user_id, first_name, surname, email, phone_number, avatar, created_at", async () => {
      const { body } = await request(app).get("/api/users/1");

      const expected = {
        user_id: 1,
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        avatar: "https://example.com/images/alice.jpg",
      };
      expect(body.user).toMatchObject(expected);
      expect(body.user.hasOwnProperty("created_at")).toBe(true);
    });
    test("returns 404 and msg when passed a user with id which does not exist", async () => {
      const { body } = await request(app).get("/api/users/90000").expect(404);
      expect(body.msg).toBe("User not found");
    });
    test("returns 400 and msg when passed invalid data type", async () => {
      const { body } = await request(app)
        .get("/api/users/not-a-number")
        .expect(400);
      expect(body.msg).toBe("Bad request: invalid data");
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
    test("returns also additional an average_rating property which calculates the average rating of body.reviews", async () => {
      const { body } = await request(app).get("/api/properties/3/reviews");
      expect(body.average_rating).toBe(4);
    });
    test("returns 200 and msg when passed a valid property id which does not exist", async () => {
      const { body } = await request(app)
        .get("/api/properties/2000/reviews")
        .expect(200);
      expect(body.msg).toBe("This property has no reviews !");
    });
    test("returns 400 and msg when passed invalid data type", async () => {
      const { body } = await request(app)
        .get("/api/properties/not-a-number/reviews")
        .expect(400);
      expect(body.msg).toBe("Bad request: invalid data");
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
      const expected = {
        review_id: 17,
        property_id: 1,
        guest_id: 4,
        rating: 5,
        comment: "Lovely place! I'd definitely recommend it.",
      };
      expect(body.review).toMatchObject(expected);
      expect(body.review.hasOwnProperty("created_at")).toBe(true);
    });

    /* test("returns 404 and msg when guest_id does not exist", async () => {
      const { body } = await request(app)
        .post("/api/properties/3/reviews")
        .send({
          guest_id: 1000,
          rating: 5,
          comment: "Great",
        })
        .expect(404);
      expect(body.msg).toBe("User not found");
    });*/

    test("returns 400 and msg when payload contains an invalid data type", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/reviews")
        .send({
          guest_id: "text",
          rating: "5",
          comment: "Not gonna pass!",
        })
        .expect(400);
      expect(body.msg).toBe("Bad request: invalid data");
    });
    test("returns 400 and msg when payload missing a not null variable", async () => {
      const { body } = await request(app)
        .post("/api/properties/3/reviews")
        .send({
          rating: 5,
          comment: "Great",
        })
        .expect(400);
      expect(body.msg).toBe("Fill up all required fields");
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

      expect(body.msg).toBe("Bad request: invalid data");
    });
    test(`returns with 404 and msg if path structure valid but review_id not in db`, async () => {
      const { body } = await request(app)
        .delete("/api/reviews/1000")
        .expect(404);

      expect(body.msg).toBe("Review not found.");
    });
  });
  describe("POST - /api/properties/:id/favourite", () => {
    test("post request to /api/properties/:id/favourite responds with 201 status", async () => {
      await request(app)
        .post("/api/properties/4/favourite")
        .send({
          guest_id: 1,
        })
        .expect(201);
    });
    test("post request returns msg and favourit_id", async () => {
      const { body } = await request(app)
        .post("/api/properties/4/favourite")
        .send({
          guest_id: 1,
        });

      expect(body.msg).toBe("Property favourited successfully");
      expect(body.favourite_id).toBe(16);
    });
    test("returns 400 when passed invalid property_id data", async () => {
      const { body } = await request(app)
        .post("/api/properties/notAnumber/favourite")
        .send({
          guest_id: 1,
        })
        .expect(400);
      expect(body.msg).toBe("Bad request: invalid data");
    });
    test("returns 400 when guest_id is invalid data", async () => {
      const { body } = await request(app)
        .post("/api/properties/4/favourite")
        .send({
          guest_id: "text",
        })
        .expect(400);
      expect(body.msg).toBe("Bad request: invalid data");
    });
    test("returns 400 when payload have not field values which are not null values", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/favourite")
        .send({})
        .expect(400);
      expect(body.msg).toBe("Fill up all required fields");
    });
    // 404 user not found and 404 property not found
    describe("DELETE - api/properties/:id/users/:id/favourite", () => {
      test("deleted request returns status 204", async () => {
        const { rows: beforeDelete } = await db.query(
          `SELECT * FROM favourites WHERE property_id = $1 AND guest_id = $2`,
          [1, 6]
        );
        await request(app)
          .delete("/api/properties/1/users/6/favourite")
          .expect(204);
        const { rows: afterDelete } = await db.query(
          `SELECT * FROM favourites WHERE property_id = $1 AND guest_id = $2`,
          [1, 6]
        );
        expect(beforeDelete.length).toBe(1);
        expect(afterDelete.length).toBe(0);
      });
      test("returns 400 when property_ir and user_id are invalid data", async () => {
        const { body } = await request(app)
          .delete("/api/properties/notAnumber/users/text/favourite")
          .expect(400);
        expect(body.msg).toBe("Bad request: invalid data");
      });
      //test user not found and property not found
    });
  });
  describe("GET - /api/properties/:id/bookings", () => {
    test("returns 200 status and an array of bookings having properties: booking_id, check_in_date, check_out_date and created_at and have as well property_id", async () => {
      const { body } = await request(app)
        .get("/api/properties/1/bookings")
        .expect(200);
      expect(body.bookings.length > 0).toBe(true);
      body.bookings.forEach((booking) => {
        expect(booking.hasOwnProperty("booking_id")).toBe(true);
        expect(booking.hasOwnProperty("check_in_date")).toBe(true);
        expect(booking.hasOwnProperty("check_out_date")).toBe(true);
        expect(booking.hasOwnProperty("created_at")).toBe(true);
      });
      expect(body.property_id).toBe(1);
    });
    test("returns 200 status and msg if property id is valid and exist but there is no bookings", async () => {
      const { body } = await request(app)
        .get("/api/properties/11/bookings")
        .expect(200);

      expect(body.msg).toBe("This property has no bookings");
    });
    test("returns 400 when id is invalid data type", async () => {
      const { body } = await request(app)
        .get("/api/properties/notAnumber/bookings")
        .expect(400);
      expect(body.msg).toBe("Bad request: invalid data");
    });
    // property id dose not exist404
  });
  describe("POST /api/properties/:id/booking", () => {
    test("post request to /api/properties/:id/booking returning status 201 and a msg", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send({
          guest_id: 1,
          check_in_date: "2025-08-15",
          check_out_date: "2025-08-20",
        })
        .expect(201);
      expect(body.booking_id).toBe(11);
      expect(body.msg).toBe("Booking successful");
    });
    test("returns 400 when invalid data is passed to property_id or payload", async () => {
      const { body } = await request(app)
        .post("/api/properties/notAnumber/booking")
        .send({
          guest_id: 1,
          check_in_date: "2025-08-15",
          check_out_date: "2025-08-20",
        })
        .expect(400);
      const { body: body2 } = await request(app)
        .post("/api/properties/1/booking")
        .send({
          guest_id: "not-a-number",
          check_in_date: "2025-11-11",
          check_out_date: "2025-12-12",
        })
        .expect(400);
      const { body: body3 } = await request(app)
        .post("/api/properties/1/booking")
        .send({
          guest_id: 1,
          check_in_date: "not-a-date",
          check_out_date: "2025-12-12",
        })
        .expect(400);
      console.log(body.res);
      expect(body.msg).toBe("Bad request: invalid data");
      expect(body2.msg).toBe("Bad request: invalid data");
      expect(body3.msg).toBe("Bad request: invalid data");
    });
    test("returns 400 when payload missing a not null variable", async () => {
      const { body } = await request(app)
        .post("/api/properties/1/booking")
        .send({
          check_in_date: "2025-11-11",
          check_out_date: "2025-12-12",
        })
        .expect(400);
      expect(body.msg).toBe("Fill up all required fields");
    });
    //404 uiser and peroperty not found
  });
  describe("DELETE - /api/bookings/:id", () => {
    test("delete request returns status 204 after deletion", async () => {
      const { rows: beforeDelete } = await db.query(
        `SELECT * FROM bookings WHERE booking_id = 1;`
      );
      expect(beforeDelete.length).toBe(1);

      await request(app).delete("/api/bookings/1").expect(204);
      const { rows: afterDelete } = await db.query(
        `SELECT * FROM bookings WHERE booking_id = 1;`
      );
      expect(afterDelete.length).toBe(0);
    });
    test("returns 400 when booking_id invalid", async () => {
      const { body } = await request(app)
        .delete("/api/bookings/notAnumber")
        .expect(400);
      expect(body.msg).toBe("Bad request: invalid data");
    });
    /*test("returns 404 when booking_id does not exist", async () => {
      const { body } = await request(app)
        .delete("/api/bookings/1000")
        .expect(404);
      expect(body.msg).toBe("Booking not found");
    });*/
  });
});
