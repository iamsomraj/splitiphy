import { List } from 'lucide-react';

type FeatureListProps = {
  children: React.ReactNode;
};

type FeatureItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const FeatureList = ({ children }: FeatureListProps) => (
  <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
    {children}
  </div>
);

const FeatureItem = ({ title, description, icon }: FeatureItemProps) => (
  <div className="relative overflow-hidden rounded-lg border bg-background p-2">
    <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
      {icon}
      <div className="space-y-2">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description} </p>
      </div>
    </div>
  </div>
);

const Feature = {
  List: FeatureList,
  Item: FeatureItem,
};

export default Feature;
