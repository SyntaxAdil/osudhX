import { Footer } from "../../components/shared/footer";
import Navbar from "../../components/shared/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen antialiased">
      <main className="min-h-full flex flex-col ">
        <Navbar></Navbar>
        <div className="h-16"></div>
        <main className="flex-1 bg-red-600">{children}</main>
        <Footer></Footer>
      </main>
    </div>
  );
}
