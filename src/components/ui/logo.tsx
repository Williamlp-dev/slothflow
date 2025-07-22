import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Origami, Zap } from 'lucide-react';

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {

  return (
    <Link href="/dashboard">
      <div className={cn('flex items-center space-x-3', className)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/30 shadow-lg">
            <Origami className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">SlothFlow</span>
        </div>
    </Link>
  );
}
