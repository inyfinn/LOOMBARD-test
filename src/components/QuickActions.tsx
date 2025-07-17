import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown, Wallet, CreditCard, PiggyBank, Send, Smartphone } from "lucide-react";

const actions = [
  { icon: ArrowUpDown, label: "Wymień", color: "text-primary" },
  { icon: Wallet, label: "Portfel", color: "text-blue-500" },
  { icon: CreditCard, label: "Karta", color: "text-purple-500" },
  { icon: PiggyBank, label: "Oszczędź", color: "text-green-500" },
  { icon: Send, label: "Wyślij", color: "text-orange-500" },
  { icon: Smartphone, label: "Płać", color: "text-red-500" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map(({ icon: Icon, label, color }) => (
        <Card key={label} className="cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="p-4 flex flex-col items-center gap-2">
            <Icon className={`${color} h-6 w-6`} />
            <span className="text-sm font-medium text-center">{label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}