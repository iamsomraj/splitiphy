const PageHeader = ({ groupName }: { groupName: string }) => (
  <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
    New Expense for {groupName}
  </h1>
);

export default PageHeader;
