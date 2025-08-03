import React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-medium">
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <GalleryVerticalEnd className="size-4" />
      </div>
      SlothFlow
    </div>
  );
}