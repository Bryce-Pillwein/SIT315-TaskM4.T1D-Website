// Root Layout tsx

import type { Metadata } from "next";
import { Inter, DM_Serif_Display, Montserrat, EB_Garamond } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ["latin"] });
const dm_serif_display = DM_Serif_Display({ weight: ['400'], subsets: ["latin"], variable: '--font-display' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: '--font-EBGaramond' });

export const metadata: Metadata = {
  title: "SIT315 - Fitness Tracker",
  description: "Task M4.T1D",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${dm_serif_display.variable} ${montserrat.variable} ${ebGaramond.variable}`}>
        {children}
      </body>
    </html>
  );
}
