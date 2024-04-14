type Props = {
  feature: string;
};

export default function UnderDevelopment({ feature }: Props) {
  return (
    <main className="flex flex-1 flex-col gap-8 py-4 pt-6 sm:py-6 lg:py-12">
      <div className="flex flex-col gap-6 text-center">
        <h1 className="text-4xl font-bold">{feature} - Under Development</h1>
        <p className="text-lg font-medium text-muted-foreground">
          This feature is currently under development. Please check back later.
        </p>
      </div>
    </main>
  );
}
