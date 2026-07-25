"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import { revalidatePath } from "next/cache";

export async function createResume(title?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();
  const userId = (session.user as any).id;

  const defaultTitle = session.user.name ? `${session.user.name}'s Resume` : "My Resume";

  const newResume = await Resume.create({
    userId,
    title: title || defaultTitle,
    fullName: session.user.name || "",
    email: session.user.email || "",
  });

  revalidatePath("/dashboard");
  return { 
    success: true, 
    resumeId: newResume._id.toString(),
    data: JSON.parse(JSON.stringify(newResume))
  };
}

export async function updateResume(id: string, data: Partial<any>) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();
  const userId = (session.user as any).id;

  // Ensure title has a fallback if cleared out during an update
  const payload = { ...data };
  if (payload.title !== undefined && (!payload.title || payload.title.trim() === "")) {
    payload.title = session.user.name ? `${session.user.name}'s Resume` : "My Resume";
  }

  const updated = await Resume.findOneAndUpdate(
    { _id: id, userId },
    { $set: payload },
    { new: true }
  );

  if (!updated) {
    throw new Error("Resume not found or unauthorized");
  }

  revalidatePath(`/builder/${id}`);
  revalidatePath("/dashboard");
  return { success: true, data: JSON.parse(JSON.stringify(updated)) };
}

export async function deleteResume(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();
  const userId = (session.user as any).id;

  await Resume.deleteOne({ _id: id, userId });
  revalidatePath("/dashboard");
  return { success: true };
}

// 🟢 UNIFIED SAVE ACTION
export async function saveResume(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const { _id, ...resumeFields } = data;
    const defaultTitle = session.user.name ? `${session.user.name}'s Resume` : "My Resume";

    // If ID is missing, empty, or "new", create a new document in MongoDB
    if (!_id || _id === "" || _id === "new") {
      await connectToDatabase();
      const userId = (session.user as any).id;

      const newResume = await Resume.create({
        ...resumeFields,
        title: resumeFields.title && resumeFields.title.trim() !== "" ? resumeFields.title : defaultTitle,
        userId,
      });

      revalidatePath("/dashboard");
      return { 
        success: true, 
        id: newResume._id.toString(), 
        data: JSON.parse(JSON.stringify(newResume)) 
      };
    }

    // Otherwise, perform update on existing ID
    return await updateResume(_id, resumeFields);
  } catch (error: any) {
    console.error("saveResume Error:", error);
    return { success: false, error: error.message || "Failed to save resume" };
  }
}