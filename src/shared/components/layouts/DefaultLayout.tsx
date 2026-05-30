import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DefaultLayoutProps {
  children: React.ReactNode;
  sideBarItems?: unknown;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div>
      <Sidebar />
      <Topbar />
      {children}
    </div>
  );
};

export default DefaultLayout;
