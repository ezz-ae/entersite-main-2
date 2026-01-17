import { redirect } from 'next/navigation';

export default async function InventoryCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  redirect(`/inventory?city=${encodeURIComponent(city)}`);
}
