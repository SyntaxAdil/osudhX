import { Footer } from "../../components/shared/footer";
import Navbar from "../../components/shared/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div className="min-h-screen w-full  antialiased">
      <main className=" min-h-screen flex flex-col ">
        <Navbar></Navbar>
        <div className="h-18"></div>
        <main className="flex-1 ">{children}</main>
        <Footer></Footer>
      </main>
    </div>
  );
}