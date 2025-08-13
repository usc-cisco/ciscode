import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { AuthProvider } from "@/contexts/auth.context";
import { Toaster } from "@/components/ui/sonner";

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased min-h-screen flex flex-col`}
      >
         <AuthProvider>
           <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Toaster richColors={true} closeButton position="bottom-right"/>
              <Footer />
            </ThemeProvider>
         </AuthProvider>
      </body>
    </html>
  );
}
