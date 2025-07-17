import { Button } from "@/components/ui/button";
import { ArrowUpDown, Wallet, CreditCard, PiggyBank, Send, Smartphone } from "lucide-react";

const actions = [
  { icon: ArrowUpDown, label: "Wymień", color: "text-primary" },
  { icon: Wallet, label: "Wpłać", color: "text-blue-500" },
  { icon: Send, label: "Wyślij", color: "text-orange-500" },
  { icon: CreditCard, label: "Karta", color: "text-purple-500" },
  { icon: PiggyBank, label: "Oszczędź", color: "text-green-500" },
  { icon: Smartphone, label: "Płać", color: "text-red-500" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.map(({ icon: Icon, label, color }) => (
        <Button key={label} variant="ghost" className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent">
          <Icon className={`${color} h-5 w-5`} />
          <span className="text-xs font-medium text-center">{label}</span>
        </Button>
      ))}
    </div>
  );
}