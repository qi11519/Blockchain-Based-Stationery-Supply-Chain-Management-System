import React, { useState } from 'react';

function DropdownExample ({ options, onChange }) {

    let firstOption = options[0];

    const [selectedOption, setSelectedOption] = useState(firstOption);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        onChange(event.target.value);
    };

    return (
        <div>
            <select value={selectedOption} onChange={handleChange}  style={{textAlign:'center', fontSize: '30px', paddingLeft: '30px', paddingRight: '30px', border:'0', borderRadius:'400px', width: '300px'}}>
                {options.map(option => (
                <option value={option} style={{textAlign:'center'}}>{option}</option>
                ))}
            </select>
        </div>
    );
}

export default DropdownExample;
