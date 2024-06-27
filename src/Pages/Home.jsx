import React from "react";
import Hero from "../layouts/Hero";
import FrameArt from "../layouts/FrameArt";
import PopularItems from "../layouts/PopularItems";
import EnhanceArt from "../layouts/EnhanceArt";
import PersonalArt from "../layouts/PersonalArt";
import FAQ from "../layouts/FAQ";

const Home = ({ onAdd, onRemove }) => {
  return (
    <div>
      <Hero />
      <FrameArt />
      <PopularItems onAdd={onAdd} onRemove={onRemove} />
      <EnhanceArt />
      <PersonalArt />
      <FAQ />
    </div>
  );
};

export default Home;
