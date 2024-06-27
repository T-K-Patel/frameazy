import ArtImg from "../assets/art_1.png";
import Button from "../components/Button";

const FrameArt = () => {
  return (
    <div className="my-20 w-[89%] mx-auto flex gap-5 flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-center items-start mb-5 md:mb-0">
        <h2 className="text-4xl font-semibold mb-6 lg:w-[450px]">
          The Art of Framing with Frameazy
        </h2>
        <p>
          At Frameazy, we're passionate about the art of framing. We believe
          that a beautifully crafted frame is not just a border for your
          artwork; it's an essential piece of the artwork itself. Each frame we
          create is a testament to our commitment to artistry and craftsmanship.
        </p>
        <Button title="Get Started" />
      </div>
      <div className="flex-1 flex justify-end">
        <img
          src={ArtImg}
          alt="frame"
          loading="lazy"
          className="rounded-xl object-cover"
        />
      </div>
    </div>
  );
};

export default FrameArt;
