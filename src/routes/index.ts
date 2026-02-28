import { OpenAPIHono } from "@hono/zod-openapi";
import type { Variables } from "../types/index";
import { authRoutes } from "./auth";
import { templeOfficialsRoutes } from "./temple-officials";
import { templeRoutes } from "./temples";
import { userRoutes } from "./users";

const app = new OpenAPIHono<{ Variables: Variables }>();

app.route("/api/auth", authRoutes);
app.route("/api/users", userRoutes);
app.route("/api/temples", templeRoutes);
app.route("/api/temple-officials", templeOfficialsRoutes);

app.get("/", (c) => {
  return c.json({ message: "Shrine Temple SNS API Server is running!" });
});

export { app as routes };
