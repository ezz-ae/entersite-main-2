'use client';

import React from "react";
import Image from "next/image";

interface Partner {
  name: string;
  logo: string;
}

interface PartnersBlockProps {
  headline?: string;
  subtext?: string;
  partners?: Partner[];
}

export function PartnersBlock({
  headline = "Our Trusted Partners",
  subtext = "We collaborate with the industry's best developers and financial institutions.",
  partners = [
      { name: "Emaar", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Emaar_Properties_logo.svg/2560px-Emaar_Properties_logo.svg.png" },
      { name: "Damac", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Damac_Properties_Logo.jpg/1200px-Damac_Properties_Logo.jpg" },
      { name: "Nakheel", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Nakheel_Logo.svg/1200px-Nakheel_Logo.svg.png" },
      { name: "Dubai Properties", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Dubai_Properties_Group_Logo.svg/1200px-Dubai_Properties_Group_Logo.svg.png" },
      { name: "Meraas", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Meraas_logo.svg/1200px-Meraas_logo.svg.png" },
      { name: "Sobha", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sobha_Realty_Logo.jpg/1200px-Sobha_Realty_Logo.jpg" },
  ]
}: PartnersBlockProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {(headline || subtext) && (
            <div className="text-center mb-12 max-w-2xl mx-auto">
                {headline && <h2 className="text-2xl font-bold mb-3">{headline}</h2>}
                {subtext && <p className="text-muted-foreground">{subtext}</p>}
            </div>
        )}
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {partners.map((partner, index) => (
                <div key={index} className="relative w-32 h-16 md:w-40 md:h-20">
                    <Image 
                        src={partner.logo} 
                        alt={partner.name} 
                        fill 
                        className="object-contain mix-blend-multiply dark:mix-blend-normal dark:invert"
                    />
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
