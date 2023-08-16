import React, { useState } from "react";

const TextField = ( {defaultText, onChange } ) => {
  const [text, setText] = useState(defaultText);

  const handleChange = (event) => {
    if (event.target.value !== ""){
        setText(event.target.value);
        onChange(event.target.value);
    } else {
        setText("-");
        onChange("-");
    }
  };

  return (
    <div>
      <input
        type="text"
        id="text-input"
        value={text}
        onChange={handleChange}
        style={{ width: "260px", height: "50px", fontSize: "25px" }}
      />
      {/* <p>Entered text: {text}</p> */}
    </div>
  );
};

export default TextField;
