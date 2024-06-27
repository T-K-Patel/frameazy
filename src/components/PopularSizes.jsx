import React from "react";
import Checkbox from "./Checkbox";

const PolularSizes = ({ setSizeCheck }) => {

  function onValueChange(event){
    // Updating the state with the selected radio button's value
    setSizeCheck(event.target.value)
}

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Popular Sizes</h2>
      <form className="flex gap-16">
        <div className="flex flex-col gap-5">
          <Checkbox
            type="radio"
            id="4x6"
            name="Popular_sizes"
            value="4 x 6"
            label="4 x 6"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="5x7"
            name="Popular_sizes"
            value="5 x 7"
            label="5 x 7"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="8x10"
            name="Popular_sizes"
            value="8 x 10"
            label="8 x 10"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="8x12"
            name="Popular_sizes"
            value="8 x 12"
            label="8 x 12"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="10x13"
            name="Popular_sizes"
            value="10 x 13"
            label="10 x 13"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="11x14"
            name="Popular_sizes"
            value="11 x 14"
            label="11 x 14"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="11x17"
            name="Popular_sizes"
            value="11 x 17"
            label="11 x 17"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="12x12"
            name="Popular_sizes"
            value="12 x 12"
            label="12 x 12"
            onChange={onValueChange}
          />
        </div>
        <div className="flex flex-col gap-5">
          <Checkbox
            type="radio"
            id="12x18"
            name="Popular_sizes"
            value="12 x 18"
            label="12 x 18"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="13x19"
            name="Popular_sizes"
            value="13 x 19"
            label="13 x 19"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="16x20"
            name="Popular_sizes"
            value="16 x 20"
            label="16 x 20"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="18x24"
            name="Popular_sizes"
            value="18 x 24"
            label="18 x 24"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="20x20"
            name="Popular_sizes"
            value="20 x 20"
            label="20 x 20"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="20x24"
            name="Popular_sizes"
            value="20 x 24"
            label="20 x 24"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="24x36"
            name="Popular_sizes"
            value="24 x 36"
            label="24 x 36"
            onChange={onValueChange}
          />
          <Checkbox
            type="radio"
            id="26x22"
            name="Popular_sizes"
            value="26 x 22"
            label="26 x 22"
            onChange={onValueChange}
          />
        </div>
      </form>
    </div>
  );
};

export default PolularSizes;
