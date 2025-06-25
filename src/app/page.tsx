
import Navbar from "@/components/Navbar";
import Header from "../components/Header";
import DisplayMainCategory from "../components/DisplayMainCategory";
import TopFoods from "@/components/TopFoods";
import AnimatedTestimonialsDemo from "../components/animated-testimonials-demo";
import ColourfulTextDemo from "../components/colourful-text-demo";
import CanteenoFooter from "@/components/ui/canteeno-footer";



export default function Home() {
  return (
    <div>
      <Navbar />
      <Header />
      <DisplayMainCategory/>
      <TopFoods/>
      <ColourfulTextDemo/>
      <AnimatedTestimonialsDemo/>
      <CanteenoFooter/>
    </div>
  );
}
