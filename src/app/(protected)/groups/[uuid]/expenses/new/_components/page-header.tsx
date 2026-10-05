const PageHeader = ({ groupName }: { groupName: string }) => (
  <h1 className="flex-1 shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0">
    New Expense for {groupName}
  </h1>
);

export default PageHeader;
