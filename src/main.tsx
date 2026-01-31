import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


// QueryClient là instance chính của TanStack Query (React Query), quản lý cache và state cho các query trong ứng dụng React.
// Nó xử lý việc fetching dữ liệu, caching, invalidation, và các tùy chọn mặc định như retry (thử lại 5 lần với delay 1000ms trong code này). 
// QueryClientProvider wrap toàn bộ app để cung cấp QueryClient cho các component con sử dụng hooks như useQuery.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen ={false} />
    </QueryClientProvider>
  </StrictMode>,
);
