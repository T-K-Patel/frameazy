import React, { useState } from "react";
import Accordion from "./Accordion";

const FAQ = () => {
    const [accordions, setAccordion] = useState([ 
        { 
            key: 1, 
            title: 'How do I get started with customizing my frames?', 
            data: `Getting started is easy! Simply click on the "Design Your Frame" button, and you'll be guided through our user-friendly customization tool. Choose your frame style, size, artwork theme, and personalization options to create the perfect frame for your needs`, 
            isOpen: false
        }, 
        { 
            key: 2, 
            title: 'Can I upload my own artwork or photos for framing?', 
            data: `Yes, you can! We offer the option to upload your own artwork or photos during the customization process. This way, you can turn your treasured memories or original artwork into beautiful framed pieces.`, 
            isOpen: false
        }, 
        { 
            key: 3, 
            title: 'What types of frames do you offer?', 
            data: `We provide a diverse selection of frame styles, including traditional, modern, rustic, and more. You can explore our range in the customization tool to find the perfect frame to complement your artwork or photos.`, 
            isOpen: false
        }, 
        { 
            key: 4, 
            title: 'How can I reach your customer support team?', 
            data: `If you have any questions, concerns, or need assistance, please don't hesitate to contact our customer support team. You can reach us through the "Contact Us" section of our website, and we'll be happy to assist you.`, 
            isOpen: false
        }, 
        { 
            key: 5, 
            title: "What if I'm not satisfied with my order?", 
            data: `Your satisfaction is important to us. If you're not completely satisfied with your order, please contact our customer support team, and we'll work with you to address any issues or concerns.`, 
            isOpen: false
        }, 
    ]);

    const toggleAccordion = (accordionkey) => { 
        const updatedAccordions = accordions.map((accord) => { 
            if (accord.key === accordionkey) { 
                return { ...accord, isOpen: !accord.isOpen }; 
            } else { 
                return { ...accord, isOpen: false }; 
            } 
        }); 
  
        setAccordion(updatedAccordions); 
    }; 

  return (
    <div className="w-[89%] mx-auto mt-[100px]">
      <h2 className="text-xl md:text-3xl mb-6 lg:text-[40px] font-semibold text-center">
        Frequently Asked Questions
      </h2>
      {accordions.map((accordion) => ( 
                    <Accordion
                        key={accordion.key} 
                        title={accordion.title} 
                        data={accordion.data} 
                        isOpen={accordion.isOpen} 
                        toggleAccordion={() => toggleAccordion(accordion.key)} 
                    /> 
                ))} 
      <div>

      </div>
    </div>
  );
};

export default FAQ;
