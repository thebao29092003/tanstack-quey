import { keepPreviousData, useInfiniteQuery, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProduct, getProducts, getProjects, getTodo, getTodosIds } from "./api"
import { all } from "axios"
import type { Product } from "../types/Product"


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
// Hàm không tham số: Viết tên hàm luôn cho gọn.
export function useTodosIds (){
   return useQuery({
    queryKey: ['todos'],
    queryFn: getTodosIds
   })            
}

// Hàm có tham số: Phải bọc trong một arrow function.
// hàm này lấy thông tin của danh sách todos thông qua id
export function useTodos(ids: (number | undefined)[] | undefined){
    return useQueries({
        queries: (ids ?? [])?.map((id) => {
           return{
            // cái queryKey này phải đồng nhất với custom hook mutation
             queryKey: ['todo', {id}],
             queryFn: () => getTodo(id!),
           } 
        })
    })
}

/*
Ứng dụng thực tế (Phân trang): Đây là kỹ thuật rất phổ biến khi làm tính năng Phân trang (Pagination).
    Không có dòng này: Khi bạn chuyển từ Trang 1 sang Trang 2, dữ liệu Trang 1 biến mất -> Hiện Loading (xoay vòng) -> Hiện dữ liệu Trang 2. Giao diện bị giật ("flash").
    Có dòng này: Khi chuyển sang Trang 2, giao diện vẫn giữ nguyên hiển thị của Trang 1 cho đến khi tải xong Trang 2 thì mới tráo đổi nội dung. 
    Người dùng cảm thấy ứng dụng mượt mà hơn và không bị ngắt quãng bởi màn hình chờ.
*/
export function useProjects(page: number) {
    return useQuery({
        queryKey: ['projects', {page}],
        queryFn : () => getProjects(page),
        placeholderData: keepPreviousData
    })
}

export function useProducts() {
    // Khác với useQuery thông thường (chỉ lấy 1 trang), 
    // hook này chuyên dùng để xử lý danh sách dữ liệu dài, cần tải từng phần (phân trang) nhưng gộp chung vào một danh sách lớn.
    return useInfiniteQuery({
        // Định danh duy nhất cho cache của danh sách sản phẩm này.
        queryKey: ['products'],
        // Hàm gọi API. React Query sẽ tự động truyền một object chứa pageParam vào hàm này để biết cần tải trang số mấy.
        queryFn: getProducts,
        // Giá trị khởi điểm của trang đầu tiên (ở đây bắt đầu từ 0).
        initialPageParam: 0,

        /*
        Hàm này quyết định xem "Trang tiếp theo là trang mấy?" và "Còn dữ liệu để tải nữa không?".
        Tham số:
            lastPage: Dữ liệu của trang vừa tải xong.
            allPages: Tất cả các trang đã tải từ trước đến giờ.
            lastPageParam: Số trang của trang vừa tải.
        Logic:
            if (lastPage.length === 0): Nếu trang vừa tải về rỗng (không có sản phẩm nào) -> Trả về undefined để báo hiệu Hết dữ liệu, ngừng tải.
            return lastPageParam + 1: Ngược lại, trang tiếp theo sẽ là trang hiện tại cộng thêm 1.
         */
        getNextPageParam : (lastPage,allPages, lastPageParam) => {
            if(lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },

        /*
        Dùng cho tính năng cuộn ngược lên trên (ít dùng hơn).
        Logic: Nếu trang hiện tại nhỏ hơn hoặc bằng 1 thì không lùi được nữa (undefined), ngược lại thì giảm đi 1.
         */
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            if(firstPageParam <= 1) {
                return undefined
            }
            return firstPageParam - 1
        }
    })
}

export function useProduct (id:number | null)  {
     const queryClient = useQueryClient ();

     return useQuery({
        queryKey: ['product', {id}],
        queryFn: () => getProduct(id!),
        enabled: !!id,
        placeholderData: () => {
            const cachedProducts = ( queryClient.getQueryData(["products"]) as {
                pages: Product[] | undefined
            } )?.pages?.flat(2);
            if(cachedProducts) {
                return cachedProducts.find((item) => item.id === id)
            }
        }
    })
}