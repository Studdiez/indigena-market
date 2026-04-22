import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Artists from "./pages/Artists";
import SEVA from "./pages/SEVA";
import Market from "./pages/Market";
import Learn from "./pages/Learn";
import Champions from "./pages/Champions";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/seva" element={<SEVA />} />
            <Route path="/market" element={<Market />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/champions" element={<Champions />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}