import { RankingsTable } from "@/components/RankingsTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Rankings() {
  const continents = [
    "All",
    "Europe",
    "North America",
    "South America",
    "Asia",
    "Africa",
    "Oceania",
    "Middle East",
  ];

  const [continent, setContinent] = useState<string>("All");

  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="container max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Rankingi 24h</h1>
        </div>

        {/* Continent selector */}
        <Tabs value={continent} onValueChange={setContinent} className="w-full">
          <TabsList className="flex flex-wrap gap-1 justify-center">
            {continents.map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs sm:text-sm">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wszystkie - full width */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Wszystkie</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RankingsTable category="all" continent={continent} showCategoryTabs={false} />
            </CardContent>
          </Card>

          {/* Zyski */}
          <Card>
            <CardHeader>
              <CardTitle>Największe zyski</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RankingsTable category="gains" continent={continent} showCategoryTabs={false} />
            </CardContent>
          </Card>

          {/* Straty */}
          <Card>
            <CardHeader>
              <CardTitle>Największe straty</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RankingsTable category="losses" continent={continent} showCategoryTabs={false} />
            </CardContent>
          </Card>

          {/* Najwyższy */}
          <Card>
            <CardHeader>
              <CardTitle>Najwyższy kurs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RankingsTable category="highest" continent={continent} showCategoryTabs={false} />
            </CardContent>
          </Card>

          {/* Najniższy */}
          <Card>
            <CardHeader>
              <CardTitle>Najniższy kurs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RankingsTable category="lowest" continent={continent} showCategoryTabs={false} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}