import { RankingsSection } from "@/components/RankingsSection";

export default function Rankings(){
  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="container max-w-lg mx-auto px-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Rankingi 24h</h1>
          <p className="text-muted-foreground">Top 5 wzrostów i spadków</p>
        </div>
        <RankingsSection />
      </div>
    </div>
  );
}