import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinLit Co-Pilot | Autonomous Wealth & Mandate Engine',
  description:
    'FinLit Co-Pilot: Institutional-grade wealth management, portfolio health monitoring, smart SIP behavioral friction engine, and Gopal AI financial co-pilot.',
  openGraph: {
    title: 'FinLit Co-Pilot | Autonomous Wealth & Mandate Engine',
    description:
      'FinLit Co-Pilot: Institutional-grade wealth management, portfolio health monitoring, smart SIP behavioral friction engine, and Gopal AI financial co-pilot.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8FAFC] dark:bg-[#0B0F15] text-[#0F172A] dark:text-[#FFFFFF] antialiased selection:bg-[#00DF8F]/20 selection:text-[#00DF8F] min-h-screen">
        {children}
      </body>
    </html>
  );
}
