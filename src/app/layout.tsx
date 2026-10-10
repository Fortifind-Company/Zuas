import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'eFootball Mobile Ghana Championship — Official Tournament Platform',
  description: 'Ghana’s premier free-to-enter eFootball Mobile competitive tournament series. Play, compete, stream on Twitch, and become the champion.',
  openGraph: {
    title: 'eFootball Mobile Championship Ghana',
    description: 'Play, compete, stream, and become the champion in Ghana’s top eFootball Mobile tournament.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
