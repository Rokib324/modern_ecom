import Hero from "@/components/Hero";
import ShopCollection from "@/components/ShopCollection";
import NewIn from "@/components/NewIn";
import FeaturedProduct from "@/components/FeaturedProduct";
import OurStory from "@/components/OurStory";
import FeaturedProduct2 from "@/components/FeaturedProduct2";
import MensKidsDress from "@/components/MensKidsDress";
import Designers from "@/components/Designers";
import OurCommunity from "@/components/OurCommunity";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopCollection />
      <NewIn />
      <FeaturedProduct />
      <OurStory />
      <FeaturedProduct2 />
      <MensKidsDress />
      <Designers />
      <OurCommunity />
    </>
  );
}
