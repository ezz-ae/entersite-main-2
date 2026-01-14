
import type { Metadata } from 'next';
import './globals.css';
import '../../mobile-styles.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';
import localFont from 'next/font/local';
import ClientLayout from './client-layout';

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter/inter-latin-wght-normal.woff2',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Entrestate',
  description:
    'All-in-one real estate platform to launch websites, generate leads, and manage your pipeline in one place.',
  metadataBase: new URL('https://entrestate.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://entrestate.com',
    siteName: 'Entrestate',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Entrestate',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} antialiased bg-black text-white selection:bg-white/20`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <ClientLayout>
                {children}
            </ClientLayout>
          <Toaster />
        </ThemeProvider>
        {facebookAppId && (
          <Script id="fb-sdk" strategy="afterInteractive">
          {`
            window.fbAsyncInit = function() {
              FB.init({
                appId      : '${facebookAppId}',
                cookie     : true,
                xfbml      : true,
                version    : 'v19.0'
              });
              FB.AppEvents.logPageView();
            };
            (function(d, s, id){
               var js, fjs = d.getElementsByTagName(s)[0];
               if (d.getElementById(id)) {return;}
               js = d.createElement(s); js.id = id;
               js.src = "https://connect.facebook.net/en_US/sdk.js";
               fjs.parentNode.insertBefore(js, fjs);
             }(document, 'script', 'facebook-jssdk'));
          `}
        </Script>
        )}
      </body>
    </html>
  );
}
