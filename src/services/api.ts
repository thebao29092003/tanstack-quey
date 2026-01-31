import axios from "axios"
import type { Todo } from "../types/todo"

const BASE_URL = "http://localhost:8080"
const axiosInstance = axios.create({baseURL: BASE_URL})


/*
Code này định nghĩa một hàm API để lấy danh sách ID của users từ JSONPlaceholder:
BASE_URL: URL gốc của API.
axiosInstance: Instance Axios với base URL để tái sử dụng.
getTodosIds: Hàm async gọi GET users, nhận array User[], map để trả về array các user.id (các số ID).
 */
export const  getTodosIds = async () => {
  return (await axiosInstance.get<Todo[]>("todos")).data.map((item):number | undefined => {
    return item.id
  })             
}

export const getTodo = async (id: number) => {
    return(await axiosInstance.get<Todo>(`/todos/${id}`)).data
}