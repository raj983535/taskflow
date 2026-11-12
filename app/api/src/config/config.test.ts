import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { envSchema } from "./config.js";

describe("API Environment Configuration Validation", () => {
  describe("PORT validation", () => {
    test("accepts valid default port when PORT is undefined", () => {
      const result = envSchema.safeParse({});
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.PORT, 5000);
      }
    });

    test("accepts valid custom integer port within range", () => {
      const result = envSchema.safeParse({ PORT: "8080" });
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.PORT, 8080);
      }
    });

    test("accepts boundary ports 1 and 65535", () => {
      const min = envSchema.safeParse({ PORT: "1" });
      const max = envSchema.safeParse({ PORT: "65535" });
      assert.equal(min.success, true);
      assert.equal(max.success, true);
    });

    test("rejects port out of range (0 or >65535)", () => {
      const zero = envSchema.safeParse({ PORT: "0" });
      const tooHigh = envSchema.safeParse({ PORT: "65536" });
      const negative = envSchema.safeParse({ PORT: "-50" });
      assert.equal(zero.success, false);
      assert.equal(tooHigh.success, false);
      assert.equal(negative.success, false);
    });

    test("rejects non-integer ports", () => {
      const floatPort = envSchema.safeParse({ PORT: "5000.5" });
      assert.equal(floatPort.success, false);
    });

    test("rejects non-numeric string ports", () => {
      const nonNumeric = envSchema.safeParse({ PORT: "not-a-port" });
      assert.equal(nonNumeric.success, false);
    });
  });

  describe("FRONTEND_ORIGIN validation", () => {
    test("accepts valid default origin when undefined", () => {
      const result = envSchema.safeParse({});
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.FRONTEND_ORIGIN, "http://localhost:5173");
      }
    });

    test("accepts valid HTTPS origin with domain", () => {
      const result = envSchema.safeParse({
        FRONTEND_ORIGIN: "https://app.taskflow.example.com",
      });
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.FRONTEND_ORIGIN, "https://app.taskflow.example.com");
      }
    });

    test("normalizes origin with trailing slash", () => {
      const result = envSchema.safeParse({
        FRONTEND_ORIGIN: "http://localhost:3000/",
      });
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.FRONTEND_ORIGIN, "http://localhost:3000");
      }
    });

    test("rejects origin containing a path", () => {
      const result = envSchema.safeParse({
        FRONTEND_ORIGIN: "http://localhost:5173/dashboard",
      });
      assert.equal(result.success, false);
    });

    test("rejects origin containing query parameters", () => {
      const result = envSchema.safeParse({
        FRONTEND_ORIGIN: "http://localhost:5173?ref=local",
      });
      assert.equal(result.success, false);
    });

    test("rejects origin containing hash fragments", () => {
      const result = envSchema.safeParse({
        FRONTEND_ORIGIN: "http://localhost:5173#section",
      });
      assert.equal(result.success, false);
    });

    test("rejects non-HTTP protocols", () => {
      const result = envSchema.safeParse({
        FRONTEND_ORIGIN: "ftp://localhost:5173",
      });
      assert.equal(result.success, false);
    });
  });
});
