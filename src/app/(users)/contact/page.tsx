import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Canteeno",
  description: "Reach out to Canteeno for any inquiries, support, or feedback. We’re here to help!",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Canteeno",
    description: "Get in touch with the Canteeno team for any questions, suggestions, or support.",
    images: ["/og/contact.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Canteeno",
    description: "We’re here to help. Contact Canteeno now.",
    images: ["/og/contact.png"],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white px-6 py-12">
      {/* HERO */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 text-transparent bg-clip-text">
          Contact Canteeno
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Have questions or feedback? We’d love to hear from you!
        </p>
      </section>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
        {/* CONTACT FORM */}
        <form className="space-y-5 bg-white/70 dark:bg-black/30 p-8 rounded-xl shadow-md ring-1 ring-black/5 backdrop-blur-md">
          <div>
            <label className="block font-medium mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full rounded-lg border px-4 py-2 bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border px-4 py-2 bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              rows={5}
              required
              placeholder="How can we help you?"
              className="w-full rounded-lg border px-4 py-2 bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Send Message
          </button>
        </form>

        {/* INFO PANEL */}
        <div className="space-y-6 text-base">
          <div className="flex items-start gap-4">
            <Image
              src="/icons/map.svg"
              alt="Map"
              width={28}
              height={28}
              className="mt-1"
            />
            <p>
              XYZ Canteen, Campus Road, University Town,
              <br />
              New Delhi, India – 110001
            </p>
          </div>

          <div className="flex items-start gap-4">
            <Image
              src="/icons/phone.svg"
              alt="Phone"
              width={28}
              height={28}
              className="mt-1"
            />
            <p>
              +91 98765 43210
              <br />
              Mon – Sat: 9:00 AM – 8:00 PM
            </p>
          </div>

          <div className="flex items-start gap-4">
            <Image
              src="/icons/mail.svg"
              alt="Email"
              width={28}
              height={28}
              className="mt-1"
            />
            <p>
              support@canteeno.in
              <br />
              Drop us a mail anytime!
            </p>
          </div>

          {/* Optional: Google Map */}
          {/* <div className="mt-8 w-full aspect-video rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
            <iframe
              title="Google Map"
              src="https://maps.google.com/maps?q=New%20Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full"
              loading="lazy"
            ></iframe>
          </div> */}
        </div>
      </div>
    </main>
  );
}
