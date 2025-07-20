import CoinSearch from "@/components/CoinSearch";
import { ModeToggle } from "@/components/mode-toggle";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col sm:flex-row items-center justify-between h-16 px-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
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

            <nav className="hidden md:flex items-center gap-1">
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

          {/* Search and Theme Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto py-2 sm:py-0">
            <CoinSearch className="w-full sm:w-64" />
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-4 px-4 sm:px-6">
        <Outlet />
      </main>

      {/* Footer */}
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
  ),
});