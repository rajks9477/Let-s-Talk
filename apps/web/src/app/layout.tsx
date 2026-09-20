import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Let's Talk — Next-Gen Unified Communication Super App",
  description: 'Fast, secure, real-time messaging, HD voice & video calling, 24h stories, broadcast channels, communities, UPI payments, canvas media studio, and built-in Aura AI assistant.',
  keywords: ['chat', 'messaging', 'webrtc', 'calls', 'super-app', 'e2ee', 'ai-assistant', 'channels', 'communities', 'upi-payments'],
  authors: [{ name: "Let's Talk Team" }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F2744',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F5EFE6] text-[#0F172A] antialiased font-sans overflow-hidden select-none selection:bg-[#1E3A8A]/20 selection:text-[#1E3A8A]">
        <div id="app-root" className="h-[100dvh] w-[100dvw] flex flex-col overflow-hidden bg-[#F5EFE6] text-[#0F172A]">
          {children}
        </div>
      </body>
    </html>
  );
}
