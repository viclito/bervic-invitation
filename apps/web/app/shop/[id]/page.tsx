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

  return (
    <>
      <Navbar />
      <main>
        <ShopProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
