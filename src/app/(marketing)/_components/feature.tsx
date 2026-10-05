type FeatureListProps = {
  children: React.ReactNode;
};

type FeatureItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const FeatureList = ({ children }: FeatureListProps) => (
  <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {children}
  </div>
);

const FeatureItem = ({ title, description, icon }: FeatureItemProps) => (
  <div className="flex gap-4 rounded-xl border bg-background p-4 transition-colors hover:bg-muted/40 sm:flex-col sm:p-5">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
      {icon}
    </div>
    <div className="space-y-1.5">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const Feature = {
  List: FeatureList,
  Item: FeatureItem,
};

export default Feature;
