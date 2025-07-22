import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";

// export const metadata = SignInPage;

import { ReactNode } from "react";

export default function SignInLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Navbar />
            <main className="pt-20">{children}</main>
            <Footer />
        </>
    );
}