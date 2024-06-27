import React from "react";
import Checkbox from "./Checkbox";

const FrameColor = ({ setColorCheck }) => {

  function onValueChange(event){
    // Updating the state with the selected radio button's value
    setColorCheck(event.target.value)
}

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Frame Colors</h2>
      <form className="flex gap-9">
        <div className="flex flex-col gap-5">
          <Checkbox
            type="radio"
            id="aqua"
            name="frame_color"
            value="Aqua"
            label="Aqua"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="black"
            name="frame_color"
            value="Black"
            label="Black"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="brown"
            name="frame_color"
            value="Brown"
            label="Brown"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="charcoal"
            name="frame_color"
            value="Charcoal"
            label="Charcoal"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="clear-stain"
            name="frame_color"
            value="Clear Stain"
            label="Clear Stain"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="gold"
            name="frame_color"
            value="Gold"
            label="Gold"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="green"
            name="frame_color"
            value="Green"
            label="Green"
            onChange={onValueChange}
          />
        </div>
        <div className="flex flex-col gap-5">
          <Checkbox
            type="radio"
            id="barnwood"
            name="frame_color"
            value="Barnwood"
            label="Barnwood"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="blonde-burl"
            name="frame_color"
            value="Blonde Burl"
            label="Blonde Burl"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="bronze"
            name="frame_color"
            value="Bronze"
            label="Bronze"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="burgundy"
            name="frame_color"
            value="Burgundy"
            label="Burgundy"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="cherry"
            name="frame_color"
            value="Cherry"
            label="Cherry"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="coffee"
            name="frame_color"
            value="Coffee"
            label="Coffee"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="honey"
            name="frame_color"
            value="Honey"
            label="Honey"
            onChange={onValueChange}
          />
        </div>
      </form>
    </div>
  );
};

export default FrameColor;
