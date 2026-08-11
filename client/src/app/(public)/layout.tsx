import { Footer } from "../../components/shared/footer";
import Navbar from "../../components/shared/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div className="min-h-screen antialiased">
      <main className="min-h-full flex flex-col ">
        <Navbar></Navbar>
        <main className="flex-1">{children}</main>
        <Footer></Footer>
      </main>
    </div>
  );
}
