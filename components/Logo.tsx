'use client';

import Image from 'next/image';

export default function Logo() {
  return (
    <div className="relative group cursor-pointer inline-block w-14 h-14 transition-transform duration-300 hover:scale-110">
      {/* Logo Image */}
      <div className="relative w-full h-full">
        <Image
          src="/logo-final.png"
          alt="BluePeak Logo"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
