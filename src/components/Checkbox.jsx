import React from "react";

const Checkbox = ({ type, id, name, value, label, onChange }) => {
  return (
    <div className="flex gap-2">
      <input type={type} id={id} name={name} value={value} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Checkbox;
