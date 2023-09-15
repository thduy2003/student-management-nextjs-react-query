import axios, { AxiosError } from "axios";
//hàm kiểm tra xem lỗi có phải là lỗi của AxiosError hay là không
//sử dụng type predicate typescript để khi trả về true thì error có kiểu là AxiosError
// sử dụng generic type truyền vào để cho data của error có kiểu dữ liệu
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}
