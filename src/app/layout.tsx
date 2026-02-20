import Providers from "@/providers/Providers";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
