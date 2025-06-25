import AboutClient from "@/components/About";
export const metadata = {
  title: "About Us | Canteeno",
  description:
    "Discover the story behind Canteeno – your campus-friendly food companion. Learn about our mission, team, values, and how we’re revolutionizing the canteen experience.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Canteeno",
    description:
      "Discover how Canteeno is transforming canteen dining – healthy meals, smart tech, and a vibrant student-focused mission.",
    images: ["/og/about.png"],
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Canteeno",
    description:
      "Behind the scenes of Canteeno – the team, the vision, and our passion for better canteen food.",
    images: ["/og/about.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
    return (
        <AboutClient/>
    )
}
