import { useQueries, useQuery } from "@tanstack/react-query"
import { getTodo, getTodosIds } from "./api"


// Code này định nghĩa một custom hook useTodosIds sử dụng TanStack Query:

// useQuery: Hook chính để fetch và cache dữ liệu.
// queryKey: ['users']: Key duy nhất để cache query này (dựa trên 'users').
// queryFn: getTodosIds: Hàm async để fetch dữ liệu (lấy danh sách ID users từ API).
// Hook trả về object với data, isLoading, isError, etc., để component sử dụng.

/*
là một thuộc tính quan trọng trong TanStack Query, dùng để định danh duy nhất cho query này. Giải thích chi tiết:

Mục đích: QueryKey giúp thư viện nhận diện và quản lý cache cho từng query riêng biệt. Nếu hai query có cùng queryKey, chúng sẽ chia sẻ cache (data được lưu trữ và tái sử dụng thay vì fetch lại từ server).
Cấu trúc: Là một array (hoặc string đơn giản), cho phép linh hoạt. Ví dụ:
    ['users']: Key đơn giản cho danh sách users.
    ['users', userId]: Key cho user cụ thể, nếu có tham số động (như ID), query sẽ refetch khi userId thay đổi.
    Có thể thêm nhiều phần tử để phân biệt queries phức tạp (ví dụ: ['posts', category, page]).

Cách hoạt động:
    Cache: Data được lưu trong cache của QueryClient dựa trên queryKey. Nếu component mount lại hoặc queryKey giống, data từ cache được dùng ngay lập tức (tránh loading không cần thiết).
    Invalidation: Khi gọi queryClient.invalidateQueries(['users']), tất cả queries với key bắt đầu bằng ['users'] sẽ bị invalidate (cache xóa, refetch data mới).
    Dependency: Nếu queryKey thay đổi (do state hoặc props), query tự động refetch. Điều này hữu ích cho queries phụ thuộc vào biến động.
Trong code này, ['users'] đảm bảo query lấy danh sách ID users được cache riêng biệt, và có thể invalidate dễ dàng khi cần cập nhật data. Nếu không có queryKey, query sẽ không được cache hoặc quản lý đúng cách.
 */
export function useTodosIds (){
   return useQuery({
    queryKey: ['todos'],
    queryFn: getTodosIds
   })            
}

export function useTodos(ids: (number | undefined)[] | undefined){
    return useQueries({
        queries: (ids ?? [])?.map((id) => {
           return{
             queryKey: ['todo', id],
             queryFn: () => getTodo(id!),
           } 
        })
    })
}
