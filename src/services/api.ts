import axios from "axios"
import type { Todo } from "../types/todo"
import type { Project } from "../types/project"
import type { Product } from "../types/Product"

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

export const createTodo = async (data: Todo) => {
  await axiosInstance.post("todos", data)
}

export const updateTodo = async (data: Todo) => {
  await axiosInstance.put(`todos/${data.id}`, data)
}

export const deleteTodo = async (id: number) => {
  await axiosInstance.delete(`todos/${id}`)
}

export const getProjects = async (page = 1) => {
  return (await axiosInstance.get<Project[]>(`projects?_page=${page}&limit=3`)).data
}

export const getProducts = async ({pageParam} : {pageParam: number}) => {
  return (await axiosInstance.get<Product[]>(`products?_page=${pageParam + 1}&limit=3`)).data
}

export const getProduct = async (id: number) => {
  return (await axiosInstance.get<Product>(`products/${id}`)).data
}