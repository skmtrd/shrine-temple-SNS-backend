import { z } from "@hono/zod-openapi";

export const CreateOfficialRequestSchema = z
  .object({
    templeId: z.number().int().positive(),
    applicantName: z.string().min(1),
    contactInfo: z.string().min(1),
    registryImageUrl: z.string().url(),
  })
  .openapi("CreateOfficialRequest");

export const OfficialRequestSchema = z
  .object({
    id: z.number(),
    userId: z.string(),
    templeId: z.number(),
    status: z.enum(["pending", "rejected", "approved"]),
    applicantName: z.string(),
    email: z.string(),
    contactInfo: z.string(),
    registryImageUrl: z.string(),
    approvedAt: z.string().nullable(),
    userName: z.string().nullable(),
    templeName: z.string().nullable(),
  })
  .openapi("OfficialRequest");

export const OfficialRequestListResponseSchema = z
  .object({
    requests: z.array(OfficialRequestSchema),
  })
  .openapi("OfficialRequestListResponse");

export const UpdateOfficialRequestStatusSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
  })
  .openapi("UpdateOfficialRequestStatus");
