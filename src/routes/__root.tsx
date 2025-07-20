import { useState } from 'react';
import CoinSearch from "@/components/CoinSearch";
import { ModeToggle } from "@/components/mode-toggle";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Menu, X } from 'lucide-react';

const RootComponent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1 transition-transform group-hover:scale-105">
                <img 
                  src="/logo.svg" 
                  alt="TrackrX logo" 
                  className="h-8 w-auto dark:invert"
                />
              </div>
              <span className="sr-only">TrackrX</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 ml-6">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md [&.active]:font-bold [&.active]:text-primary [&.active]:bg-accent"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md [&.active]:font-bold [&.active]:text-primary [&.active]:bg-accent"
              >
                About
              </Link>
              <Link
                to="/watchlist"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md [&.active]:font-bold [&.active]:text-primary [&.active]:bg-accent"
              >
                Watchlist
              </Link>
              <Link
                to="/coin/compare"
                className="text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md [&.active]:font-bold [&.active]:bg-orange-100 dark:[&.active]:bg-orange-900/30 [&.active]:text-orange-600 dark:[&.active]:text-orange-400"
              >
                Compare
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <CoinSearch className="w-64" />
            </div>
            <ModeToggle />
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur">
            <div className="container px-4 pt-2 pb-4 space-y-1">
              <CoinSearch className="w-full mb-3" />
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-accent [&.active]:font-bold [&.active]:text-primary [&.active]:bg-accent"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-accent [&.active]:font-bold [&.active]:text-primary [&.active]:bg-accent"
              >
                About
              </Link>
              <Link
                to="/watchlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-accent [&.active]:font-bold [&.active]:text-primary [&.active]:bg-accent"
              >
                Watchlist
              </Link>
              <Link
                to="/coin/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-accent [&.active]:font-bold [&.active]:bg-orange-100 dark:[&.active]:bg-orange-900/30 [&.active]:text-orange-600 dark:[&.active]:text-orange-400"
              >
                Compare
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 container py-4 px-4 sm:px-6">
        <Outlet />
      </main>

      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="TrackrX logo" 
              className="h-5 w-auto dark:invert"
            />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TrackrX. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>

      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent
});