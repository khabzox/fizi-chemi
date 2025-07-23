import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";
import { ReactNode } from "react";

// export const metadata = MetadataSignUp;

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Navbar />
            <main className="pt-20">{children}</main>
            <Footer />
        </>
    );
}