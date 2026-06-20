import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoSmartCardProvider } from "@/contexts/GoSmartCardContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <GoSmartCardProvider>
        <TooltipProvider delayDuration={200}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GoSmartCardProvider>
    </ThemeProvider>
  );
}

export default App;
