import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'StudyTrack — PaaS Integrated Student Study Hub',
  description: 'A modern cloud-native student task and study management hub powered by Vercel, Supabase, and Cloudinary.',
  keywords: ['PaaS', 'Vercel', 'Supabase', 'Cloudinary', 'Next.js', 'PostgreSQL', 'Cloud Storage'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
