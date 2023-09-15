import { Student } from "@/types/students.type";
import { studentsRepo } from "@/utils/fake-database";
import { validateEmail } from "@/utils/validateEmail";
import { NextRequest, NextResponse } from "next/server";
export async function PUT(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const { studentId } = params;
  const data: Student = await req.json();
  if (!validateEmail(data.email)) {
    return new NextResponse(
      JSON.stringify({
        error: {
          email: "Email không đúng định dạng",
        },
      }),
      {
        status: 422,
        headers: { "Content-Type": "application/json" },
      }
    );
  } else {
    studentsRepo.update(studentId, { ...data, id: studentId });
    return NextResponse.json({ ...data, id: studentId });
  }
}
export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const { studentId } = params;

  return NextResponse.json(studentsRepo.getById(studentId));
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const { studentId } = params;
  studentsRepo.delete(studentId);
  return NextResponse.json({});
}
