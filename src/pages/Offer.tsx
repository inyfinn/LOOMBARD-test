import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OfferPage(){
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pb-16 pt-4 container max-w-2xl mx-auto px-4 space-y-6">
      <Button variant="ghost" onClick={()=>navigate(-1)}>← Wróć</Button>
      <Card>
        <CardHeader>
          <CardTitle>Lokata Premium 4,5 %</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <img src="https://cdn.pixabay.com/photo/2016/11/18/14/25/coins-1834657_1280.jpg" alt="saving" className="w-full rounded"/>
          <p>Oprocentowanie stałe 4,5 % rocznie. Minimalna kwota 500 PLN, brak ukrytych opłat.</p>
          <img src="https://cdn.pixabay.com/photo/2016/10/09/19/19/business-1728080_1280.jpg" alt="growth" className="w-full rounded"/>
          <p>Odsetki kapitalizowane miesięcznie. Wypłata środków w dowolnym momencie bez utraty odsetek.</p>
          <Button onClick={()=>navigate('/')}>Rozpocznij inwestycję</Button>
        </CardContent>
      </Card>
    </div>
  );
} 