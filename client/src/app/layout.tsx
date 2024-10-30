import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'MNNITHunt - Campus Adventure',
  description: 'Embark on an exciting scavenger hunt adventure at MNNIT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}