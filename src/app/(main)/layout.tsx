import NavBar from '@/components/shared/nav-bar';

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
