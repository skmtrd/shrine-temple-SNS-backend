import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { env } from "./config/env";
import { routes } from "./routes";
import type { Variables } from "./types";

const app = new OpenAPIHono<{ Variables: Variables }>();

// CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// ルートをマウント
app.route("/", routes);

// OpenAPI ドキュメント
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Shrine Temple SNS API",
    version: "1.0.0",
    description: "神社仏閣 SNS バックエンド API",
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: "Local",
    },
  ],
  security: [{ Bearer: [] }],
});

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// Swagger UI
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

export { app };
