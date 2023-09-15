"use client";
import { Student } from "@/types/students.type";
import {
  addStudent,
  getStudent,
  updateStudent,
} from "@/utils/api/students.api";
import { isAxiosError } from "@/utils/ixAxiosError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "react-toastify";
type FormStateType = Omit<Student, "id">;
const initialFormState: FormStateType = {
  avatar: "",
  email: "",
  btc_address: "",
  country: "",
  first_name: "",
  gender: "other",
  last_name: "",
};
//lấy key từ key của formState {email, first_name,....}
type FormError =
  | {
      [key in keyof FormStateType]: string;
    }
  | null;
const StudentDetailPage = () => {
  const [formState, setFormState] =
    React.useState<FormStateType>(initialFormState);

  const { studentId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  let isAddMode = studentId === "add" ? true : false;
  //studentQuery lấy thông tin chi tiết của student, khi mà studentId là số thì mới chạy api này tránh lỗi, vì vào /students/add sẽ không chạy nha
  const studentQuery = useQuery({
    queryKey: ["student", Number(studentId)],
    queryFn: () => getStudent(Number(studentId)),
    enabled: !isNaN(Number(studentId)),
  });

  //uppdate Mutation
  const updateStudentMutation = useMutation({
    mutationFn: (_) => {
      return updateStudent(Number(studentId), formState);
    },
    onSuccess() {
      //vấn đề là khi update thành công thì queryKey của thằng query dùng để lấy data chi tiết vẫn còn giữ nguyên data cũ
      //cập nhật lại data cũ đó thành data mới được update
      queryClient.setQueryData(["student", Number(studentId)], formState);
    },
  });

  //add mutation
  const addStudentMutation = useMutation({
    mutationFn: (_) => {
      return addStudent(formState);
    },
  });

  //lấy error từu error api trả về theo lỗi 422
  const errorForm: FormError = React.useMemo(() => {
    const error = isAddMode
      ? addStudentMutation.error
      : updateStudentMutation.error;
    if (
      isAxiosError<{ error: FormError }>(error) &&
      error.response?.status === 422
    ) {
      return error.response?.data.error;
    }
    return null;
  }, [addStudentMutation.error, isAddMode, updateStudentMutation.error]);

  //hàm thay đổi lại state khi nhập input
  const handleChange =
    (name: keyof FormStateType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [name]: event.target.value }));
      if (addStudentMutation.data || addStudentMutation.error) {
        //khi đang có error mà điền vào input thì tự động xóa lỗi và data cũ đi
        addStudentMutation.reset();
      }
      if (updateStudentMutation.data || updateStudentMutation.error) {
        updateStudentMutation.reset();
      }
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAddMode) {
      // do tham số của hàm mutationFn truyền _ nên ở đây truyền undefined
      addStudentMutation.mutate(undefined, {
        onSuccess() {
          toast.success("Tạo thành công");
          router.push("/students");
        },
      });
    } else {
      updateStudentMutation.mutate(undefined, {
        //dùng onSuccess ở đây hay trên useMutation đều chạy song song như nhau
        onSuccess(data, variables, context) {
          toast.success("Cập nhật thành công");
        },
      });
    }
  };

  React.useEffect(() => {
    if (studentQuery?.data) {
      setFormState(studentQuery.data.data);
    }
  }, [studentQuery.data]);
  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? "Add" : "Edit"} Student</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='floating_email'
            id='floating_email'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            value={formState.email}
            onChange={handleChange("email")}
            required
          />
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Email address
          </label>
          {errorForm && (
            <p className='mt-2 text-sm text-red-600'>
              <span className='font-medium'>Lỗi! </span>
              {errorForm.email}
            </p>
          )}
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  name='gender'
                  value='male'
                  checked={formState.gender === "male"}
                  onChange={handleChange("gender")}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label
                  htmlFor='gender-1'
                  className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                >
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  name='gender'
                  value='female'
                  checked={formState.gender === "female"}
                  onChange={handleChange("gender")}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label
                  htmlFor='gender-2'
                  className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                >
                  Female
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            id='country'
            value={formState.country}
            onChange={handleChange("country")}
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            required
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='tel'
              name='first_name'
              id='first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
              value={formState.first_name}
              onChange={handleChange("first_name")}
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
              value={formState.last_name}
              onChange={handleChange("last_name")}
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
              value={formState.avatar}
              onChange={handleChange("avatar")}
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              value={formState.btc_address}
              onChange={handleChange("btc_address")}
              required
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-pink-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-pink-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default StudentDetailPage;
