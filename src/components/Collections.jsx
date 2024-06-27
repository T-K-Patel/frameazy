import React from "react";
import Checkbox from "./Checkbox";

const Collections = ({ setCollectCheck }={setCollectCheck:()=>{}}) => {
  
  function onValueChange(event){
    // Updating the state with the selected radio button's value
    setCollectCheck(event.target.value)
}

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Collections</h2>
      <form className="flex flex-col gap-5">
        <Checkbox
          type="radio"
          id="natural_wood"
          name="collections"
          value="Natural wood collection"
          label="Natural wood collection"
          onChange={onValueChange}
        />
        <Checkbox
          type="radio"
          id="closeout"
          name="collections"
          value="Closeout picture frames"
          label="Closeout picture frames"
          onChange={onValueChange}
        />
      </form>
    </div>
  );
};

export default Collections;
