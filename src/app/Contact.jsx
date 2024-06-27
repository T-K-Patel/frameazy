import ContactForm from "../components/ContactForm";
import ContactMap from "../components/ContactMap"

const Contact = () => {
  return (
    <div>
      <div className="bg-[url('/src/assets/contact-hero.svg')] h-[200px] md:h-[400px] bg-center bg-cover">
        <div className="backdrop-brightness-50 h-full flex items-center justify-center">
          <h2 className="text-2xl md:text-6xl text-white font-semibold">Contact Us</h2>
        </div>
      </div>
      <div className="w-[91%] lg:w-[82%] mx-auto mt-20">
        <h3 className="text-2xl md:text-3xl font-semibold mb-10">Love to hear from you, <br />Get in touch</h3>
        <div className="flex gap-10 flex-col lg:flex-row">
          <ContactForm />
          <ContactMap />
        </div>
      </div>
    </div>
  );
};

export default Contact;
