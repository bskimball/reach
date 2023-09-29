import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@components/AuthContext.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <div className="container">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
