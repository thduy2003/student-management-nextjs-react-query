"use client";
import { Table } from "antd";
import React from "react";
import { columns } from "./ColumnInfo";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteStudent, getStudents } from "@/utils/api/students.api";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
const LIMIT = 10;
const StudentsListTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  //lấy page và limit từ trên url ?page=1&limit=10
  const page = Number(searchParams.get("page")) || 1;
  let limit = Number(searchParams.get("limit")) || LIMIT;

  const queryClient = useQueryClient();

  //studentQuery, phụ thuộc vào key students , page và limit, keepPreviousData để giữ data trước đó để từ trang 1 sang trang 2 không cần phải load
  const studentsListQuery = useQuery({
    queryKey: ["students", page, limit],
    queryFn: () => getStudents(page, limit),
    keepPreviousData: true,
  });

  //delete mutation, khi xóa thành công thì dùng invalidateQueries để chạy lại api get List nó cũng giống useQuery thôi tức là chạy lại studentsListQuery đó, exact: true để chính xác với query đó theo queryKey
  const deleteStudentMutation = useMutation({
    mutationFn: (studentId: string) => {
      return deleteStudent(studentId);
    },
    onSuccess(_, studentId) {
      toast.success(`Xóa student với id là ${studentId} thành công`);
      queryClient.invalidateQueries({
        queryKey: ["students", page, limit],
        exact: true,
      });
    },
  });
  return (
    <div>
      {studentsListQuery.data && (
        <Table
          columns={columns({ deleteStudentMutation })}
          dataSource={studentsListQuery.data.data.result}
          scroll={{ y: 700 }}
          pagination={{
            defaultCurrent: page,
            current: page,
            showSizeChanger: true,
            onChange(page, pageSize) {
              router.push(`/students?page=${page}&limit=${limit}`);
            },

            onShowSizeChange(current, size) {
              limit = size;
            },
            pageSize: limit,

            total: studentsListQuery.data.data.total,
          }}
        />
      )}
    </div>
  );
};

export default StudentsListTable;
