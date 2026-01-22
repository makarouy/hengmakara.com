import Preloader from "@/components/ui/preloader";
import "./global.css"
import BootstrapForBrowser from "@/components/ui/bootstrapForBrowser";
import Header from "@/components/sections/header";
import CallToAction from "@/components/sections/callToAction";
import Footer from "@/components/sections/footer";

export const metadata = {
  metadataBase: new URL('https://hengmakara.com'),
  title: {
    default: "Heng Makara | Social Media Recovery & Digital Marketing Expert",
    template: "%s | Heng Makara"
  },
  description: "Expert Social Media Account Recovery (Facebook, Instagram, Gmail) and Professional Digital Marketing Services. Trusted by thousands for fast, secure solutions.",
  keywords: [
    "Social Media Recovery", 
    "Facebook Account Recovery", 
    "Instagram Hacked Account", 
    "Gmail Recovery Service", 
    "Digital Marketing Consultant", 
    "Heng Makara", 
    "Hacking Solutions", 
    "Cyber Security Help",
    "Social Media Security",
    "Cambodia Digital Expert"
  ],
  authors: [{ name: "Heng Makara", url: "https://hengmakara.com" }],
  creator: "Heng Makara",
  publisher: "Heng Makara",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Heng Makara | Social Media Recovery & Digital Marketing Expert",
    description: "Lost access to your social media? Need digital marketing growth? I provide professional account recovery and marketing strategies.",
    url: 'https://hengmakara.com',
    siteName: 'Heng Makara Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/about/admin-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Heng Makara - Digital Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Heng Makara | Social Media Recovery & Digital Marketing Expert",
    description: "Expert Social Media Account Recovery and Digital Marketing Services.",
    images: ['/images/about/admin-1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  // JSON-LD Schema for the Person/Organization
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Heng Makara',
    url: 'https://hengmakara.com',
    image: 'https://hengmakara.com/images/about/admin-1.jpg',
    sameAs: [
      'https://facebook.com/hengmakara',
      // Add other social links if known, otherwise user can add later
    ],
    jobTitle: 'Digital Marketing Specialist & Recovery Expert',
    worksFor: {
      '@type': 'Organization',
      name: 'Heng Makara Services'
    },
    description: 'Specialist in social media account recovery and digital marketing strategies.'
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BootstrapForBrowser />
        <Preloader />
        <Header />
        {children}
        <CallToAction />
        <Footer />
      </body>
    </html>
  );
}
