import { useState } from "react";
import { useProjects } from "../services/queries";
import type { Project } from "../types/project";

export default function Projects() {
  const [page, setPage] = useState(1);
  const { data, isPending, error, isError, isPlaceholderData, isFetching } =
    useProjects(page);

  return (
    <div style={{ marginTop: "50px" }}>
      {isPending ? (
        <span>Loading ...</span>
      ) : isError ? (
        <span>There is an error !</span>
      ) : (
        <div>
          {data.map((project: Project) => (
            <p key={project.id}>
                {project.name}
            </p>
          ))}
        </div>
      )}
      <span>Current page: {page}</span>
      <button onClick={() => setPage((old) => Math.max(old - 1, 0))}>Previous Page</button>
      <button onClick={() => {
        if(!isPlaceholderData){
            setPage((old) => old + 1);
        }
      }}
      disabled={isPlaceholderData}
      
      >Next Page</button>
      {isFetching && <span>Loading ...</span>}
    </div>
  );
}
