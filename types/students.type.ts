export interface Student {
  avatar: string;
  last_name: string;
  email: string;
  first_name: string;
  country: string;
  btc_address: string;
  gender: string;
  id: string;
}
export type Students = Pick<Student, "avatar" | "email" | "last_name" | "id">[];
