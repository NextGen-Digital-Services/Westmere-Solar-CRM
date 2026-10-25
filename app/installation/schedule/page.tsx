'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InstallationScheduleRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/installation');
  }, [router]);
  return null;
}
