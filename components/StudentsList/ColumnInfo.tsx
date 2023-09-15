import { Student } from "@/types/students.type";
import { UseMutationResult } from "@tanstack/react-query";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AxiosResponse } from "axios";
import Image from "next/image";
import Link from "next/link";

export type StudentType = Pick<
  Student,
  "avatar" | "email" | "last_name" | "id"
>;
interface Props {
  deleteStudentMutation: UseMutationResult<
    AxiosResponse<{}, any>,
    unknown,
    string,
    unknown
  >;
}
//truyền deleteMutation từ table vào columns để mutate theo id
export function columns({
  deleteStudentMutation,
}: Props): ColumnsType<StudentType> {
  return [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "AVATAR",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, { avatar, last_name }) => {
        return (
          <Image
            src={avatar}
            alt={last_name}
            width={40}
            height={40}
            className='w-[40px] h-[40px] rounded-full'
          />
        );
      },
    },
    {
      title: "NAME",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size='middle'>
          <Link href={`/students/${record.id}`} className='text-blue-500'>
            Edit
          </Link>
          <button
            onClick={() => deleteStudentMutation.mutate(record.id)}
            className='text-red-500'
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];
}
