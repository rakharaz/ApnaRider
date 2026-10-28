import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'SmartRider — On-Demand Shopping and Delivery',
  description: 'SmartRider (Apna Rider): transparent on-demand shopping and delivery.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
