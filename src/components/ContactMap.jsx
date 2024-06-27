import React from "react";

const ContactMap = () => {
  return (
    <div className="flex-1">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30765943.659494564!2d60.99760082208102!3d19.729291400175878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sng!4v1700910608420!5m2!1sen!2sng"
        className="h-[315px] lg:h-[574px] w-full"
        style={{border:0, borderRadius: "12px"}}
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default ContactMap;
