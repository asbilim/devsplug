import { Inter,Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider"
const poppins = Poppins({ subsets: ["latin"] ,weight:["100","200","300","400","500","600","700","800","900"]})
export const metadata = {
  title: "Devsplug",
  description: "Devsplug Join an amazing dev community with youth cameroonians , learn grow and challenge other developers",
};

export default function RootLayout({ children }) {
  return (
    <html 
      suppressHydrationWarning
      lang="en"
    >
      
        <body className={poppins.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnchange
          >
            {children}
          </ThemeProvider>    
        </body>
      
    </html>
  );
}
