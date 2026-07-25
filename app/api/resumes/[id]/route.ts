import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume"; // ✅ Correct (Default Import)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const updatedResume = await Resume.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: false }
    );

    if (!updatedResume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedResume, { status: 200 });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update resume" },
      { status: 500 }
    );
  }
}