import { CircleUser, Menu } from 'lucide-react';
import Link from 'next/link';

import { Icons } from '@/components/shared/icons';
import ThemeModeToggle from '@/components/theme-mode-toggle';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
import { getLoggedInUser } from '@/db/queries';
import paths from '@/lib/paths';
import { ClerkLoaded, Show, SignOutButton } from '@clerk/nextjs';

const NavBar = async () => {
  const user = await getLoggedInUser();
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60 md:px-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href={paths.home()}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:relative sm:block">
            {siteConfig.name}
            <span className="absolute right-0 -bottom-4 text-[10px] font-semibold">
              (beta)
            </span>
          </span>
        </Link>
        <ClerkLoaded>
          <Show when="signed-in">
            <Link
              href={paths.dashboard()}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </Show>
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
                <span className="absolute right-0 -bottom-4 text-[10px] font-semibold">
                  (beta)
                </span>
              </span>
            </Link>
            <ClerkLoaded>
              <Show when="signed-in">
                <SheetClose asChild>
                  <Link
                    href={paths.dashboard()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                </SheetClose>
              </Show>
              <Show when="signed-out">
                <SheetClose asChild>
                  <Link
                    href={paths.getStarted()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Get Started
                  </Link>
                </SheetClose>
              </Show>
            </ClerkLoaded>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ThemeModeToggle />
        <Show when="signed-in">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {user?.profileImage ? (
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.profileImage}
                    alt={user.firstName + '' + user.lastName}
                    className="object-cover"
                  />
                </Avatar>
              ) : (
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={paths.settings()}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <SignOutButton>
                  <Link href={paths.home()}>Logout</Link>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Show>
      </div>
    </header>
  );
};

export default NavBar;
