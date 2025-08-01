const request = require("supertest");
const app = require("../app");
const db = require("../db/data/connection");
const seed = require("../db/data/seed");

beforeEach(() => {
  return seed();
});
afterAll(() => {
  db.end();
});

describe("app", () => {
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
    });
  });
  describe.only("GET - /api/properties/:id", () => {
    test("a get request to /api/properties/:id returns with status of 200", async () => {
      await request(app).get("/api/properties/6").expect(200);
    });

    test("get request to /api/properties/:id returns one property with matching property_id", async () => {
      const { body } = await request(app).get("/api/properties/3");
      expect(body.property.property_id).toBe(3);
    });
    test("get request to /api/properties/:id returns an object with an array with key: property that contains properties, property_id, property_name, location, price_per_night, description, host, host_avatar and favourite_count", async () => {
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
    });
  });
});
