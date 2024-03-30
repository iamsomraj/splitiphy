'use client';
import { Button } from '@/components/ui/button';
import paths from '@/lib/paths';
import { ClerkLoaded, ClerkLoading, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Header = () => {
  return (
    <header>
      <ClerkLoading>
        <p>Auth (Loading)</p>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <p>Auth (Signed In)</p>
          <UserButton afterSignOutUrl={paths.home()} />
        </SignedIn>
        <SignedOut>
          <p>Auth (Signed Out)</p>
          <SignInButton
            mode='modal'
            afterSignInUrl={paths.groups()}
            afterSignUpUrl={paths.groups()}
          >
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
      </ClerkLoaded>
    </header>
  );
};

export default Header;