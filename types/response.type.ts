export interface ResponseData<DataType> {
  result: DataType;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
