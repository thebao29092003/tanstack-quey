import { useMutation } from "@tanstack/react-query";
import type { Todo } from "../types/todo";
import { createTodo } from "./api";

/*
- Đây là giải thích ngắn gọn về vòng đời của một Mutation trong React Query qua ví dụ của bạn:
- mutationFn: Hàm thực hiện việc thay đổi dữ liệu (thường là gọi API POST/PUT/DELETE). Ở đây là gọi hàm createTodo(data).
- onMutate: Chạy ngay lập tức khi hàm mutation được gọi, trước khi API có kết quả. Thường dùng để làm "Optimistic Update" (cập nhật giao diện trước để tạo cảm giác nhanh chóng).
- onSuccess: Chạy khi API thành công. Thường dùng để thông báo thành công hoặc làm mới lại danh sách dữ liệu (Invalidate queries).
- onError: Chạy khi API thất bại/có lỗi. Thường dùng để thông báo lỗi hoặc hoàn tác (rollback) lại dữ liệu nếu trước đó có dùng onMutate.
- onSettled: Chạy cuối cùng, bất kể kết quả là thành công hay thất bại (giống như finally trong try-catch). Thường dùng để tắt trạng thái loading hoặc thực hiện các thao tác dọn dẹp.
Tóm tắt luồng chạy:
onMutate -> [Gửi API] -> (onSuccess hoặc onError) -> onSettled.
 */
export function useCreateTodo() {
  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    onMutate:() => {
        console.log("mutate")
    },

    onError: () => {
        console.log("error")
    },

    onSuccess: () => {
        console.log("success")
    },

    onSettled: (data, error, ) => {
        console.log("onSettled")
    }
  });
}
