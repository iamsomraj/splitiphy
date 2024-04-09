import { CircleUser, Menu } from 'lucide-react';
import Link from 'next/link';

import { Icons } from '@/components/shared/icons';
import ThemeModeToggle from '@/components/theme-mode-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { siteConfig } from '@/config/site';
import paths from '@/lib/paths';
import { ClerkLoaded, SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs';

const NavBar = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href={paths.home()}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:relative sm:block">
            {siteConfig.name}
            <span className="absolute -bottom-4 right-0 text-[10px] font-semibold">
              (beta)
            </span>
          </span>
        </Link>
        <ClerkLoaded>
          <SignedIn>
            <Link
              href={paths.dashboard()}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </SignedIn>
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
              <Icons.logo className="h-6 w-6" />
              <span className="relative font-bold">
                {siteConfig.name}
                <span className="absolute -bottom-4 right-0 text-[10px] font-semibold">
                  (beta)
                </span>
              </span>
            </Link>
            <ClerkLoaded>
              <SignedIn>
                <SheetClose asChild>
                  <Link
                    href={paths.dashboard()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                </SheetClose>
              </SignedIn>
              <SignedOut>
                <SheetClose asChild>
                  <Link
                    href={paths.getStarted()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Get Started
                  </Link>
                </SheetClose>
              </SignedOut>
            </ClerkLoaded>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ThemeModeToggle />
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={paths.account()}>My Account</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={paths.settings()}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={paths.home()}>
                <DropdownMenuItem asChild>
                  <SignOutButton>Logout</SignOutButton>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
      </div>
    </header>
  );
};

export default NavBar;
