import { Student, Students } from "@/types/students.type";
import http from "../http";
import { ResponseData } from "@/types/response.type";

export const getStudents = (page: number | string, limit: number | string) =>
  http.get<ResponseData<Students>>("api/students", {
    params: {
      _page: page,
      _limit: limit,
    },
  });

export const getStudent = (studentId: string | number) =>
  http.get<Student>(`api/students/${studentId}`);

export const updateStudent = (
  studentId: string | number,
  data: Omit<Student, "id">
) => http.put<Student>(`api/students/${studentId}`, data);

export const addStudent = (data: Omit<Student, "id">) =>
  http.post<Student>("api/students", data);

export const deleteStudent = (studentId: string | number) =>
  http.delete<{}>(`api/students/${studentId}`);
