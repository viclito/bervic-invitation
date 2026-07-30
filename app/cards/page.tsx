import { Suspense } from 'react';
import { Metadata } from 'next';
import CardGenerator from '@/components/cards/CardGenerator';


export const metadata: Metadata = {
  title: 'Instagram Card Generator — Bervic Invitations',
  description: 'Create stunning high-resolution Instagram wedding announcement cards. Choose from 8 beautiful templates, fill in your details, and download a 1080x1080px PNG or PDF.',
};

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#221C17] flex items-center justify-center text-[#F8F3EA] text-sm font-bold">Loading Instagram Card Generator...</div>}>
      <CardGenerator />
    </Suspense>
  );
}
