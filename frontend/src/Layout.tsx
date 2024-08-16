import MainMenu from "./components/menu/MainMenu";

interface Props {
    children: React.ReactNode;
}

function Layout({ children }: Props) {
    return (
      <div>
        <MainMenu />
        <main>{children}</main>
      </div>
    );
  }

  export default Layout;