import { createFileRoute } from "@tanstack/react-router";
import {
  RocketIcon,
  LineChart,
  Bookmark,
  Search,
  Moon,
  Sun,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="container py-8 px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <RocketIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          About TrackrX
        </h1>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
        <p className="text-muted-foreground mb-6">
          TrackrX is a dynamic cryptocurrency dashboard that provides real-time
          market data, interactive charts, and powerful comparison tools. Built
          with modern web technologies, it offers an intuitive interface for
          both casual observers and serious crypto enthusiasts.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<LineChart className="h-6 w-6" />}
            title="Real-time Data"
            description="Live cryptocurrency prices, market caps, and trading volumes from CoinGecko API"
          />
          <FeatureCard
            icon={<Bookmark className="h-6 w-6" />}
            title="Personal Watchlist"
            description="Save your favorite coins using browser localStorage"
          />
          <FeatureCard
            icon={<Search className="h-6 w-6" />}
            title="Advanced Search"
            description="Find coins by name or symbol with instant results"
          />
          <FeatureCard
            icon={
              <>
                <Moon className="h-6 w-6" />
                <Sun className="h-6 w-6" />
              </>
            }
            title="Theme Switching"
            description="Toggle between light and dark modes for comfortable viewing"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary/10 p-2 rounded-lg">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
