import { auth } from '@clerk/nextjs/server';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Redirects signed-out visitors to sign in, then back to this page.
  await auth.protect();

  return <div className="flex-1">{children}</div>;
}
