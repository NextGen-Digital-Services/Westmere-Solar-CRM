'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ElectricalInspectionsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/electrical');
  }, [router]);
  return null;
}
