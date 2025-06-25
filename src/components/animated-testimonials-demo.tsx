import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Every lunch break feels like a mini‑festival now! The biryani section is legendary and the new QR ordering is a life‑saver during rush hour.",
      name: "Priya Mehta",
      designation: "Software Engineer • BlockTech HQ Canteen",
      src: "https://media.istockphoto.com/id/1489414046/photo/portrait-of-an-attractive-empowered-multiethnic-woman-looking-at-camera-and-charmingly.webp?a=1&b=1&s=612x612&w=0&k=20&c=Py9Xl6WFDTAv_w5aJHh6PE31IN0ffVRtqDwDInLA9uc=",
    },
    {
      quote:
        "Thanks to the live‑counter dashboard, we cut wastage by 30 %. Staff finally know exactly what to prep. Customers get piping‑hot parathas instead of leftovers.",
      name: "Arjun Sharma",
      designation: "Operations Lead • UniServe Campus Cafeteria",
      src: "https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29ufGVufDB8fDB8fHww",
    },
    {
      quote:
        "Parents keep emailing us about how clean and transparent the new canteen system is. Online wallets + nutritional labels = happy guardians & healthier kids.",
      name: "Neha Gupta",
      designation: "Principal • GreenField Public School",
      src: "https://media.istockphoto.com/id/1448071240/photo/indian-woman-wearing-spectacles-reading-news-paper-in-college-library-with-bookshelf-behind.webp?a=1&b=1&s=612x612&w=0&k=20&c=YLfzi6nXdYkDeh65hc5dWJKgaYoHHealJqbQn1XU0Rw=",
    },
    {
      quote:
        "We serve 5 000 plates a day. The automatic inventory alerts mean we never run out of dosa batter again. Massive win for both chefs and students!",
      name: "Chef Raghav",
      designation: "Head Chef • MetroCity Engineering Mess",
      src: "https://plus.unsplash.com/premium_photo-1687697861242-03e99059e833?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The feedback kiosks pushed our veggie wrap rating from 3.1 ★ to 4.8 ★ in two weeks. Real‑time analytics helped us tweak the sauce exactly right.",
      name: "Aditi Nair",
      designation: "Food Quality Analyst • HealthBite Corporate Café",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww",
    },
  ];

  return (
    <section className="pt-2 pb-0">
      <AnimatedTestimonials testimonials={testimonials} autoplay />
    </section>
  )
}
