import { clerkMiddleware } from '@clerk/nextjs/server';

// Clerk's proxy only attaches auth state to the request. Access control lives
// next to the data: the (protected) layout, server actions, and queries all
// check the session themselves.
// See https://clerk.com/docs/reference/nextjs/clerk-middleware
export default clerkMiddleware({
  // Signed-out visitors are sent to our own sign-in page, not Clerk's portal.
  signInUrl: '/get-started',
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
