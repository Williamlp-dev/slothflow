import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ModeToggle } from '../theme/theme-button';

export default function SimpleHeader() {
  return (
    <header className="fixed left-1/2 top-4 z-50 w-full max-w-4xl -translate-x-1/2 px-4">
      <div className="flex h-16 items-center justify-between rounded-full border border-border bg-background/80 px-6 backdrop-blur-md shadow-lg">
        
      <Logo />

      <div className='flex gap-4'>
        <ModeToggle className="rounded-full" />
            <Link href="/login"
             >
        <Button className="rounded-full">
          Login
        </Button>
        </Link>
      </div>
      </div>
    </header>
  );
}