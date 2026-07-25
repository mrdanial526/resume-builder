"use server";

import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function registerUser(formData: { name: string; email: string; password: string }) {
  try {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      return { error: "Please fill in all fields" };
    }

    await connectToDatabase();
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    await User.create({ name, email, password });
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to register user" };
  }
}