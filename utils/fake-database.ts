import fs from "fs";
import studentsArray from "../data/students.json";
import { NextRequest } from "next/server";

import { nanoid } from "nanoid";
import { Student } from "@/types/students.type";
let students: Student[] = studentsArray;
//giả lập một fake database and method
export const studentsRepo: {
  getAll: (params: { page: number; limit: number }) => void;
  getLength: () => number;
  getById: (id: string) => void;
  find: (x: any) => void;
  create: (student: Omit<Student, "id">) => void;
  update: (id: string, student: Student) => void;
  delete: (id: string) => void;
} = {
  //get thì trả về từng này trường thôi
  getAll: (params) => {
    const result = students.map((a) => ({
      avatar: a.avatar,
      last_name: a.last_name,
      id: a.id,
      email: a.email,
    }));
    if (params.page == 1) {
      return result.slice(0, params.limit * params.page);
    }
    if (params.page !== 1) {
      return result.slice(
        (params.page - 1) * params.limit,
        params.limit * params.page
      );
    }
  },
  getById: (id) => students.find((x) => x.id.toString() === id.toString()),
  find: (x) => students.find(x),
  create,
  update,
  getLength: () => students.length,
  delete: _delete,
};
function create(student: Omit<Student, "id">) {
  let id =
    students.length > 0
      ? (Math.max(...students.map((x) => Number(x.id))) + 1).toString()
      : "1";
  // add and save user
  students.push({ ...student, id });
  saveData();
}

function update(id: string, params: Student) {
  const student = students.find((x) => x.id === id);

  //const target = { a: 1, b: 2 };
  // const source = { b: 4, c: 5 };
  //const returnedTarget = Object.assign(target, source);
  // Expected output: Object { a: 1, b: 4, c: 5 }
  // dùng Object.assign để hợp nhất các sự thay đổi trả về luôn cho target đó nha
  // update and save
  if (student) Object.assign(student as Student, params);
  saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id: string) {
  // filter out deleted user and save
  students = students.filter((x) => x.id !== id);
  saveData();
}
function saveData() {
  fs.writeFileSync("./data/students.json", JSON.stringify(students, null, 4));
}
