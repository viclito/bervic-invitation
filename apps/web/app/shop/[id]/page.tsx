import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopProductDetailClient from "@/components/shop/ShopProductDetailClient";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

interface Props {
  params: Promise<{ id: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureDbSchema();
  const { id } = await params;

  const product = await prisma.shopProduct.findUnique({
    where: { id },
  });

  if (!product) {
    return {
      title: "Product Not Found | Bervic Print Shop",
    };
  }

  const isGift =
    product.category === "return_gifts" ||
    ["brass", "hampers", "silver", "bags", "candles"].includes(product.category);

  const title = `${product.name} - Handcrafted ${isGift ? "Return Gift" : "Wedding Invitation Card"} | Bervic Shop`;
  const description =
    product.description ||
    `Order ${product.name} printed on luxury ${product.paperType} with gold foil stamping and express doorstep delivery across India.`;

  const imageUrl = product.previewImage.startsWith("http")
    ? product.previewImage
    : `${baseUrl}${product.previewImage.startsWith("/") ? "" : "/"}${product.previewImage}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      "wedding invitation cards",
      "traditional wedding cards",
      "handcrafted invitations",
      product.paperType,
      "gold foil wedding cards",
      "Bervic shop",
    ],
    alternates: {
      canonical: `${baseUrl}/shop/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/shop/${product.id}`,
      siteName: "Bervic Invitations",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ShopProductPage({ params }: Props) {
  await ensureDbSchema();
  const { id } = await params;

  const product = await prisma.shopProduct.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Fetch similar / related products from the same category
  const relatedProducts = await prisma.shopProduct.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
      isActive: true,
    },
    take: 6,
    orderBy: { sortOrder: "asc" },
  });

  const isGift =
    product.category === "return_gifts" ||
    ["brass", "hampers", "silver", "bags", "candles"].includes(product.category);

  const productImageUrl = product.previewImage.startsWith("http")
    ? product.previewImage
    : `${baseUrl}${product.previewImage.startsWith("/") ? "" : "/"}${product.previewImage}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [productImageUrl],
    description:
      product.description ||
      `Order ${product.name} printed on luxury ${product.paperType} with gold foil stamping and doorstep delivery across India.`,
    sku: `BERVIC-${product.id}`,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: "Bervic Invitations",
    },
    category: isGift ? "Return Gifts & Favours" : "Wedding & Event Invitation Cards",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/shop/${product.id}`,
      priceCurrency: "INR",
      price: product.pricePerCard,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Bervic Invitations",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewsCount.toString(),
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Navbar />
      <main>
        <ShopProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
