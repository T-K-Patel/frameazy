import React from "react";
import Checkbox from "./Checkbox";

const FrameCategory = ({ setCategoryCheck }) => {

  function onValueChange(event){
    // Updating the state with the selected radio button's value
    setCategoryCheck(event.target.value)
}
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Frame Category</h2>
      <form className="flex flex-col gap-5">
        <Checkbox
          type="radio"
          id="frame-single"
          name="frame_category"
          value="Frame + Single mat"
          label="Frame + Single mat"
          onChange={onValueChange}
        />
        <Checkbox
          type="radio"
          id="frame-double"
          name="frame_category"
          value="Frame + Double mat"
          label="Frame + Double mat"
          onChange={onValueChange}
        />
        <Checkbox
          type="radio"
          id="picture-frame"
          name="frame_category"
          value="Picture Frames"
          label="Picture Frames"
          onChange={onValueChange}
        />
        <Checkbox
          type="radio"
          id="collage-single"
          name="frame_category"
          value="Collages + Single mat"
          label="Collages + Single mat"
          onChange={onValueChange}
        />
        <Checkbox
          type="radio"
          id="collage-double"
          name="frame_category"
          value="Collages + Double mat"
          label="Collages + Double mat"
          onChange={onValueChange}
        />
        <Checkbox
          type="radio"
          id="diploma-frame"
          name="frame_category"
          value="Diplomas Frame"
          label="Diplomas Frame"
          onChange={onValueChange}
        />
      </form>
    </div>
  );
};

export default FrameCategory;
