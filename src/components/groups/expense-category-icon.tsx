import constants from '@/lib/constants';
import { cn } from '@/lib/utils';
import * as RadixIcons from '@radix-ui/react-icons';

type SVGProps = React.ComponentProps<'svg'>;

type ExpenseCategoryIconProps = {
  icon: string;
} & SVGProps;

export const ExpenseCategoryIcon = ({
  icon,
  className,
  children,
  ...rest
}: ExpenseCategoryIconProps) => {
  const Icon = (RadixIcons?.[icon as keyof typeof RadixIcons] ||
    null) as React.ElementType;
  if (!Icon) {
    const Icon =
      RadixIcons[
        constants.expenseCategoryIcons.DEFAULT_ICON as keyof typeof RadixIcons
      ];
    return <Icon className={cn('mr-2 h-4 w-4', className)} {...rest} />;
  }
  return <Icon className={cn('mr-2 h-4 w-4', className)} {...rest} />;
};
