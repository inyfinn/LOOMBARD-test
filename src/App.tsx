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
import { TopNavigation } from "./components/TopNavigation";
import { WalletProvider } from "@/context/WalletContext";
import TransactionsPage from "@/pages/Transactions";
import OfferPage from "./pages/Offer";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <WalletProvider>
          <BrowserRouter>
            <div className="relative min-h-screen bg-background">
              <TopNavigation />
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
            </div>
          </BrowserRouter>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
