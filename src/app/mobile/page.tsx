import dynamic from 'next/dynamic';

// Mobile UI is a client-only experience.
const MobileApp = dynamic(() => import('../gemini-app/MobileApp'), { ssr: false });

export default function MobilePage() {
  return <MobileApp />;
}
