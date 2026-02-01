import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-[90%] mx-auto">{children}</div>
      <Footer />
    </div>
  );
}
