import HeroImg from "../assets/hero_img.png";
import Button from "../components/Button";

const Hero = () => {
  return (
    <div className="flex gap-5 flex-col md:flex-row bg-dark-blue h-full md:h-screen">
      <div className="flex-1 text-white mx-5 sm:mx-10 md:ml-14 lg:ml-20 md:mx-0 flex flex-col justify-center items-start my-10 md:my-0">
        <h1 className="text-4xl lg:text-6xl font-bold pb-5">
          Design Your Dream Frames with Frameasy
        </h1>
        <p>
          Frameazy Where Your Imagination Meets Our Craftsmanship. Our Passion
          is Crafting Beautiful Frames, Personalized Just for You. Explore
          Endless Possibilities
        </p>
        <Button title="Explore" />
      </div>
      <div className="w-full flex-1 flex justify-center md:justify-end">
        <img
          src={HeroImg}
          alt="hero"
          loading="lazy"
          className="w-full md:h-screen object-cover h-[375px]"
        />
      </div>
    </div>
  );
};

export default Hero;
