import { Student } from "@/types/students.type";
import { studentsRepo } from "@/utils/fake-database";
import { validateEmail } from "@/utils/validateEmail";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams?.get("_page")) || 1;
  const limit = Number(searchParams?.get("_limit")) || 10;
  const total = studentsRepo.getLength();
  return NextResponse.json({
    result: studentsRepo.getAll({ page, limit }),
    page,
    limit,
    total: total,
    total_pages: Math.ceil(total / limit),
  });
}
export async function POST(req: NextRequest) {
  const data: Omit<Student, "id"> = await req.json();
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
    studentsRepo.create(data);
    return NextResponse.json({ data });
  }
}
