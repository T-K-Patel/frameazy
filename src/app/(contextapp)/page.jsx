'use client'
import React from "react";
import Hero from "../../layouts/Hero";
import FrameArt from "../../layouts/FrameArt";
import PopularItems from "../../layouts/PopularItems";
import EnhanceArt from "../../layouts/EnhanceArt";
import PersonalArt from "../../layouts/PersonalArt";
import FAQ from "../../layouts/FAQ";
import NavBar from '../../layouts/Nav_bar';
import Footer from '../../layouts/Footer';

const Home = () => {
  return (
    <>
      <NavBar/>
      <div>
        <Hero />
      <FrameArt />
      <PopularItems onAdd={() => { }} onRemove={() => { }} />
      <EnhanceArt />
      <PersonalArt />
        <FAQ />
      </div>
      <Footer/>
    </>
  );
};

export default Home;
