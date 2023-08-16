import React, { useState } from 'react';

const InputSpinner = ({ defaultValue, onChange }) => {

  const [value, setValue] = useState(defaultValue);

  const handleDecrement = () => {
    setValue(value === 0 ? value : value - 1);
    onChange(value === 0 ? value : value - 1);
  };

  const handleIncrement = () => {
    setValue(value + 1);
    onChange(value + 1);
  };

  return (
    <div>
      <button onClick={handleDecrement} style={{fontSize: '30px', color:'white', backgroundColor:'rgb(71, 107, 179)', border:'0', borderRadius:'500px', width: '50px', marginRight: '20px'}}>-</button>
      <input type="text" value={value} readOnly style={{fontSize: '30px', width: '60px', textAlign:'center'}}/>
      <button onClick={handleIncrement} style={{fontSize: '30px', color:'white', backgroundColor:'rgb(71, 107, 179)', border:'0', borderRadius:'500px', width: '50px', marginLeft: '20px'}}>+</button>
    </div>
  );
};

export default InputSpinner;
