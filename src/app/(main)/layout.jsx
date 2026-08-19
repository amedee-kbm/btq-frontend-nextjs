import Footer from "./footer";

export default function MainLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
