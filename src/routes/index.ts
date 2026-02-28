import { OpenAPIHono } from "@hono/zod-openapi";
import type { Variables } from "../types";
import { authRoutes } from "./auth";
import { userRoutes } from "./users";

const app = new OpenAPIHono<{ Variables: Variables }>();

app.route("/api/auth", authRoutes);
app.route("/api/users", userRoutes);

app.get("/", (c) => {
  return c.json({ message: "Shrine Temple SNS API Server is running!" });
});

export { app as routes };
