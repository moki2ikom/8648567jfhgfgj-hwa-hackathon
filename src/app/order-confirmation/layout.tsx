import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order confirmation',
  description: 'The demo order record for a Sniff & Solve station.',
  alternates: { canonical: '/order-confirmation' },
  robots: { index: false, follow: false },
};

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
