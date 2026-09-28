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
    <html lang="en">
      <body className="bg-apple-bg text-apple-text dark:bg-eco-950 dark:text-eco-50 min-h-screen antialiased selection:bg-env-emerald selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
