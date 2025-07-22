import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";

// export const metadata = SignInPage;

export default function SignInLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="pt-20">{children}</main>
            <Footer />
        </>
    );
}