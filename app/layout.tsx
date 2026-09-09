import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Inspira — Curated Visual & Design Showcase',
  description: 'A contemporary digital showcase platform where creators publish and discover inspiring architecture, photography, 3D art, and digital concepts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
