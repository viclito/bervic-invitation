import type { Metadata } from "next";
import { templatesRegistry } from "@/data/templatesRegistry";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = templatesRegistry.find((t) => t.slug === slug);

  if (!template) {
    return {
      title: "Template Preview | Bervic Invitations",
    };
  }

  const pageTitle = `${template.title} — Premium ${template.categoryLabel} Invitation Template | Bervic`;
  const pageDesc = template.description || `Preview and customize the ${template.title} digital invitation template on Bervic. Perfect for ${template.categoryLabel} celebrations with interactive features & RSVP.`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [
      `${template.title} template`,
      `${template.categoryLabel} invitation template`,
      "Indian digital invite builder",
      "Bervic templates",
      template.styleTag,
    ],
    alternates: {
      canonical: `${baseUrl}/templates/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `${baseUrl}/templates/${slug}`,
      siteName: "Bervic Invitations",
      images: [
        {
          url: template.previewImage || "/images/category-wedding.jpg",
          width: 1200,
          height: 630,
          alt: `${template.title} Preview`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [template.previewImage || "/images/category-wedding.jpg"],
    },
  };
}

export default async function TemplateDetailLayout({ params, children }: Props) {
  const { slug } = await params;
  const template = templatesRegistry.find((t) => t.slug === slug);

  const jsonLdProduct = template
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: template.title,
        description: template.description,
        image: `${baseUrl}${template.previewImage}`,
        brand: {
          "@type": "Brand",
          name: "Bervic Invitations",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: template.price ? String(template.price) : "0",
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/templates/${slug}`,
        },
      }
    : null;

  return (
    <>
      {jsonLdProduct && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
        />
      )}
      {children}
    </>
  );
}
