import { z } from "zod";

export const createContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  type: z.enum(["customer", "vendor", "both"], {
    message: "Type must be customer, vendor, or both",
  }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters")
    .optional()
    .or(z.literal("")),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(500, "Address cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .trim()
    .max(100, "City cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  state: z
    .string()
    .trim()
    .max(100, "State cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must contain exactly 6 digits")
    .optional()
    .or(z.literal("")),

  profileUrl: z
    .string()
    .trim()
    .url("Invalid profile image URL")
    .max(2048, "Profile image URL is too long")
    .optional()
    .or(z.literal("")),
});

export const updateContactSchema = createContactSchema.partial();
export const contactIdSchema = z.object({
    id: z.string().uuid("Invalid contact ID"),
});