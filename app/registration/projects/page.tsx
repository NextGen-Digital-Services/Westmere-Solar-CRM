'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrationProjectsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/registration');
  }, [router]);
  return null;
}
