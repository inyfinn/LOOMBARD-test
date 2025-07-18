import { RankingsTable } from "@/components/RankingsTable";

export default function Rankings(){
  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="container max-w-lg mx-auto px-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Rankingi 24h</h1>
          <p className="text-muted-foreground">Obszerna lista z podziałem na kategorie</p>
        </div>
        <RankingsTable />
      </div>
    </div>
  );
}