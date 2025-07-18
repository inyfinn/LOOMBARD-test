import { useWallet } from "@/context/WalletContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

export default function TransactionsPage(){
  const { transactions } = useWallet();
  const [page,setPage] = useState(0);
  const itemsPerPage=25;
  const slice = transactions.slice(page*itemsPerPage,(page+1)*itemsPerPage);

  return (
    <div className="min-h-screen bg-background pb-16 pt-4 container max-w-md mx-auto px-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Transakcje</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          {slice.map((t,idx)=>{
            const date = new Date(t.timestamp).toLocaleString('pl-PL');
            if(t.type==='deposit') return (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex items-center gap-2"><ArrowDown className="text-green-600"/><span>Wpłata {t.currency}</span></div>
                <span className="text-green-600">+{t.amount.toFixed(2)}</span>
              </div>
            );
            if(t.type==='withdraw') return (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex items-center gap-2"><ArrowUp className="text-red-600"/><span>Wypłata {t.currency}</span></div>
                <span className="text-red-600">-{t.amount.toFixed(2)}</span>
              </div>
            );
            return (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex items-center gap-2"><ArrowLeftRight className="text-primary"/><span>{t.from}→{t.to}</span></div>
                <div className="text-right text-sm">
                  <p className="text-green-600">+{t.received?.toFixed(2)} {t.to}</p>
                  <p className="text-red-600">-{t.amount.toFixed(2)} {t.from}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
} 