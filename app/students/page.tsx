import StudentsListTable from "@/components/StudentsList/StudentsListTable";
import Link from "next/link";
import React from "react";

const StudentsPage = () => {
  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div className='mt-2 mb-5'>
        <Link
          href='/students/add'
          className=' rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 '
        >
          Add Student
        </Link>
      </div>
      <StudentsListTable />
    </div>
  );
};

export default StudentsPage;
