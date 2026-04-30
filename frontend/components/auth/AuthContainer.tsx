'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            {children}
            <div className="bg-muted relative hidden md:block">
              <Image
                src="/auth-banner.jpg"
                alt="Authentication Banner"
                loading="eager"
                fill
                className="dark:brightness-[0.6]"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
