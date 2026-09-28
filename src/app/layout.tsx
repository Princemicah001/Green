import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eco-Shield Sentinel Network | Environmental Intelligence for Critical Infrastructure',
  description: 'Enterprise climate and environmental stress intelligence platform connecting climate data, infrastructure telemetry, and community observations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-eco-950 text-eco-50 min-h-screen antialiased selection:bg-eco-700 selection:text-eco-50">
        {children}
      </body>
    </html>
  );
}
