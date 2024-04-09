type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
