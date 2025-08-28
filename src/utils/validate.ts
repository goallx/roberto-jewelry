import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
    birthday: z.object({
      day: z.string(),
      month: z.string(),
      year: z.string(),
    }),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d+$/, "Phone number must contain only numbers"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
