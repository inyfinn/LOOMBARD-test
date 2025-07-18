import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp } from "lucide-react";

export function PromoBanner() {
  const navigate = useNavigate();
  const { deposit, balances } = useWallet();

  const handleStart=()=>{
    const pln = balances["PLN"]||0;
    const gain = pln*0.045;
    deposit("PLN",parseFloat(gain.toFixed(2)));
    alert("Zyskałeś 4,5% rocznie!");
  };

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white relative overflow-hidden">
      <CardContent className="p-4">
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                LOKATA PREMIUM
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400/30">
                <TrendingUp size={12} className="mr-1" />
                4,5% rocznie
              </Badge>
            </div>
            
            <h3 className="font-bold mb-1">Lokata Premium 4,5%</h3>
            <p className="text-sm opacity-90 mb-3">
              Zainwestuj swoje PLN w bezpieczną lokatę z gwarantowanym oprocentowaniem 4,5% rocznie.
            </p>
            
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-white/90" onClick={()=>navigate('/lokata-premium')}>
                Dowiedz się więcej
              </Button>
              <Button variant="ghost" size="sm" className="text-white border-white/30 hover:bg-white/20" onClick={handleStart}>
                Rozpocznij
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>
      </CardContent>
    </Card>
  );
}