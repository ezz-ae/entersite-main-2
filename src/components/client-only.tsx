'use client';

import * as React from 'react';

/**
 * A component that only renders its children on the client side.
 * This is useful for resolving hydration mismatches.
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
