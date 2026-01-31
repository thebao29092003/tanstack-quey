import { useIsFetching } from "@tanstack/react-query";
import { useTodos, useTodosIds } from "../services/queries";

export default function Todo() {
  const { data, isPending, isError, fetchStatus, status } = useTodosIds();
  const isFetching = useIsFetching();
  const todosQueries = useTodos(data)

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
      <p >Dùng hook gọi nhiều api cùng 1 lúc</p>
      {todosQueries.map(({data}) => (
        <li key={data?.id}>
          <div>Id: {data?.id}</div>
          <span>
            <strong>Title:</strong> {data?.title}, {" "}
            <strong>Desc:</strong> {data?.description}, {" "}
          </span>
        </li>
      ))}
    </>
  );
}
