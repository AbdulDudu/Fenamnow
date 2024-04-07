import Footer from "@web/modules/common/shared/footer";
import Navbar from "@web/modules/common/shared/navbar";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
