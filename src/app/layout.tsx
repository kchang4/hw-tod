import type { Metadata } from "next"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { ThemeProvider } from "@mui/material"
import { Roboto } from "next/font/google"
import theme from "./theme"


export const metadata: Metadata = {
  title: "Highwind TOD",
  description: "Crowdsourced TOD data for Highwind on Horizonxi",
};

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '100%', width: '100%' }}>
      <body className={roboto.variable} style={{ margin: 0, padding: 0, height: '100%', width: '100%' }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
