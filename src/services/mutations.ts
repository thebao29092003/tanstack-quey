import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "../types/todo";
import { createTodo, deleteTodo, updateTodo } from "./api";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    onMutate: () => {
      console.log("mutate");
    },

    onError: () => {
      console.log("error");
    },

    onSuccess: () => {
      console.log("success");
    },

    onSettled: async (_, error) => {
      console.log("onSettled");
      if (error) {
        console.log(error);
      } else {
        // Lệnh này báo cho React Query biết rằng dữ liệu của key ['todos'] (danh sách công việc) đã bị cũ.
        // React Query sẽ tự động tải lại (refetch) danh sách todo từ API để giao diện hiển thị dữ liệu mới nhất (bao gồm todo vừa tạo).
        await queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
      }
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => updateTodo(data),

    /*
    Tham số:
        _: Kết quả trả về từ API (data), ở đây không dùng nên đặt là _.
        error: Lỗi nếu API thất bại.
        variables: Chính là dữ liệu data (object Todo) mà bạn đã truyền vào khi gọi hàm mutate. 
        Cái này rất quan trọng ở đây để lấy id.
     */
    onSettled: async (_, error, variables) => {
      if (error) {
        console.log(error);
      } else {
        // làm mới dữ liệu
        /*
        invalidateQueries để làm mới dữ liệu:
            queryKey: ["todos"]: Báo cho React Query biết danh sách tổng các Todo đã cũ -> Tự động tải lại danh sách Todo.
            queryKey: ["todo", {id: variables.id}]: Báo cho React Query biết chi tiết của riêng cái Todo vừa sửa (dựa vào variables.id) đã cũ -> Tự động tải lại chi tiết Todo này.
        Tại sao cần invalidate 2 lần?
            Lần 1 (['todos']) để cập nhật danh sách bên ngoài (ví dụ: thay đổi tiêu đề hiển thị trong list).
            Lần 2 (['todo', {id}]) để cập nhật nếu người dùng đang xem trang chi tiết của Todo đó, đảm bảo dữ liệu ở trang chi tiết cũng được đồng bộ ngay lập tức.
         */
        await queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["todo", { id: variables.id }],
        });
      }
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
        console.log("success");
    },
    onSettled: async (_, error, variables) => {
        if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
      }
    }
  });
}
