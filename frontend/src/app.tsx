import AppRoutes from "@/routes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/providers/Session.tsx";
export default function App() {
  const queryClient = new QueryClient()

  console.log(import.meta.env.VITE_GOOGLE_API_KEY)
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
      <AppRoutes />
      </SessionProvider>
      <Toaster />
    </QueryClientProvider>
  )
}