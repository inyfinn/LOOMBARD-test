import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rates from "./pages/Rates";
import Rankings from "./pages/Rankings";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { BottomNav } from "./components/BottomNav";
import { WalletProvider } from "@/context/WalletContext";
import TransactionsPage from "./pages/Transactions";
import OfferPage from "./pages/Offer";
import { UpdateInfo } from "@/components/UpdateInfo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WalletProvider>
        <BrowserRouter>
          <div className="relative">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/kursy" element={<Rates />} />
              <Route path="/transakcje" element={<TransactionsPage />} />
              <Route path="/rankingi" element={<Rankings />} />
              <Route path="/lokata-premium" element={<OfferPage/>} />
              <Route path="/ustawienia" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
            <UpdateInfo />
          </div>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
