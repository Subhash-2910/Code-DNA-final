import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CODE-DNA - AI automation agency framer template',
  description:
    'CODE-DNA is a modern AI automation agency Framer template, perfect for AI startups and tech businesses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={figtree.className}>{children}</body>
    </html>
  );
}
