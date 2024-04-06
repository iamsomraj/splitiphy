import { CircleUser, Divide, Menu } from 'lucide-react';
import Link from 'next/link';

import ThemeModeToggle from '@/components/theme-mode-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import paths from '@/lib/paths';
import {
  ClerkLoaded,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';

const NavBar = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href={paths.home()}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Divide className="h-6 w-6" />
          <span className="sr-only">Splitiphy Inc</span>
        </Link>
        <ClerkLoaded>
          <SignedIn>
            <Link
              href={paths.groups()}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Groups
            </Link>
            <SignOutButton>
              <button className="text-nowrap text-muted-foreground hover:text-foreground">
                Sign Out
              </button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              afterSignInUrl={paths.groups()}
              afterSignUpUrl={paths.groups()}
            >
              <button className="text-muted-foreground hover:text-foreground">
                Login
              </button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href={paths.home()}
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Divide className="h-6 w-6" />
              <span className="sr-only">Splitiphy Inc</span>
            </Link>
            <ClerkLoaded>
              <SignedIn>
                <Link
                  href={paths.groups()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Groups
                </Link>
                <SignOutButton>
                  <button className="text-muted-foreground hover:text-foreground">
                    Sign Out
                  </button>
                </SignOutButton>
              </SignedIn>
              <SignedOut>
                <SignInButton
                  mode="modal"
                  afterSignInUrl={paths.groups()}
                  afterSignUpUrl={paths.groups()}
                >
                  <button className="text-muted-foreground hover:text-foreground">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ThemeModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavBar;
