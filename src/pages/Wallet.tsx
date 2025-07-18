import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WalletPage() {
  const { balances, rates } = useWallet();
  const navigate = useNavigate();

  const entries = Object.entries(balances).sort((a,b)=> {
    if(a[0]==='PLN') return -1; if(b[0]==='PLN') return 1; return 0;
  });

  const format = (amt:number, cur:string)=> new Intl.NumberFormat('pl-PL',{minimumFractionDigits:2, maximumFractionDigits:2}).format(amt)+` ${cur}`;

  return (
    <div className="min-h-screen bg-background pb-16 pt-4 container max-w-md mx-auto px-4 space-y-4">
      <button onClick={()=>navigate(-1)} className="flex items-center gap-1 text-sm text-primary"><ArrowLeft size={16}/>Wróć</button>
      <h1 className="text-2xl font-bold text-center mb-4">Mój portfel</h1>

      <Card>
        <CardHeader>
          <CardTitle>Salda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.map(([cur, bal])=> (
            <div key={cur} className="flex justify-between items-center py-2 border-b last:border-0">
              <span className="font-medium">{cur}</span>
              <div className="text-right">
                <p className="font-medium">{format(bal, cur)}</p>
                {cur!=='PLN' && (
                  <p className="text-xs text-muted-foreground">≈ {format(bal*(rates[cur]||0), 'PLN')}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 