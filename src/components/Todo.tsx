import { useIsFetching } from "@tanstack/react-query";
import { useTodos, useTodosIds } from "../services/queries";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../services/mutations";
import { useForm } from "react-hook-form";
import type { Todo } from "../types/todo";

export default function Todo() {
  const { data, isPending, isError, fetchStatus, status } = useTodosIds();
  const isFetching = useIsFetching();
  const todosQueries = useTodos(data);

  const createTodoMutation = useCreateTodo();
  const handleCreateTodoSubmit = (data: Todo) => {
    createTodoMutation.mutate(data);
  };

  // useForm là một hook từ thư viện react-hook-form, dùng để quản lý trạng thái của form trong React.
  // Nó cung cấp các phương thức như register, handleSubmit, watch, formState để xử lý validation, submit và
  // theo dõi thay đổi của form một cách hiệu quả.
  // Đúng vậy, useForm từ react-hook-form cung cấp phương thức register để đăng ký các input field với form state, thay thế cho việc dùng useState thủ công cho từng field.
  // Điều này giúp quản lý dữ liệu form, validation và submit một cách hiệu quả hơn, đặc biệt với các form phức tạp.
  // Bạn có thể dùng register trong thuộc tính ref của input để kết nối.
  const { register, handleSubmit } = useForm<Todo>();

  const updateTodoMutation = useUpdateTodo();
  // sửa ở đây đơn giản là mình chuyển checked thành true
  const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
    if (data) {
      updateTodoMutation.mutate({ ...data, checked: true });
    }
  };

  const deleteTodoMutation = useDeleteTodo();
  const handleDelte = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  if (isPending) {
    return <span>loading ...</span>;
  }
  if (isError) {
    return <span>there is an error !</span>;
  }

  return (
    <>
      <p>Query function status: {fetchStatus}</p>
      <p>Query data status: {status}</p>
      <p>Global isFetching: {isFetching}</p>
      {data?.map((id) => (
        <p key={id}>id: {id}</p>
      ))}

      <p style={{ height: "20px" }}></p>
      <p>Dùng hook gọi nhiều api cùng 1 lúc</p>
      {todosQueries.map(({ data }) => (
        <li key={data?.id}>
          <div>Id: {data?.id}</div>
          <span>
            <strong>Title:</strong> {data?.title}, <strong>Desc:</strong>{" "}
            {data?.description},{" "}
          </span>
          <div>
            {/* nếu checked là true thì không cho sửa nữa */}
            <button
              onClick={() => handleMarkAsDoneSubmit(data)}
              disabled={data?.checked}
            >
              {data?.checked ? "Done" : "Mark as done"}
            </button>
            {data?.id && (
              <button onClick={() => handleDelte(data?.id!)}>Delete</button>
            )}
          </div>
        </li>
      ))}

      <p style={{ height: "20px" }}></p>
      <p>Dùng hook mutation cho method post</p>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>New todo:</h4>
        {/* Đúng vậy, register("title") trả về một object chứa các props cần thiết (như onChange, onBlur, name, ref) để kết nối input với form state của react-hook-form. 
        Khi dùng {...register("title")}, nó spread (mở rộng) các props này vào element <input>, giúp thư viện tự động quản lý giá trị và validation của field "title" mà không cần code thủ công. */}
        <input placeholder="Title" type="text" {...register("title")} />
        <br />
        <input
          placeholder="Description"
          type="text"
          {...register("description")}
        />
        <br />
        <input
          type="submit"
          disabled={createTodoMutation.isPending}
          value={createTodoMutation.isPending ? "Creating ..." : "Create todo"}
        />
      </form>
    </>
  );
}
