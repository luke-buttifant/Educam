import { useState, useRef, useEffect } from "react"

const SearchableDropdown = (props) => {
    const { options, onInputChange } = props;
    const ulRef = useRef();
    const inputRef = useRef();
    useEffect(() => {
      inputRef.current.addEventListener('click', (event) => {
        event.stopPropagation();
        ulRef.current.style.display = 'block';
        onInputChange(event);
      });
      document.addEventListener('click', (event) => {
        ulRef.current.style.display = 'none';
      });
    }, []);
    return (
        <>
<input
          id="search-bar"
          size={40}
          type="text"
          className="row-span-1 col-span-2 shadow rounded m-2 h-10 p-2"
          placeholder="Search"
          ref={inputRef}
          onChange={onInputChange}
        />
        
        <ul id="results" className="rounded shadow-md my-2 relative max-h-20 overflow-auto" ref={ulRef}>
          {options.map((option, index) => {
            return (
              <button
                type="button"
                key={index}
                onClick={(e) => {
                  inputRef.current.value = option;
                }}
                className="p-2 block text-black hover:bg-grey-light cursor-pointer max-h-10 "
              >
                {option}
              </button>
            );
          })}
        </ul>
        </>
    );
  };

export default SearchableDropdown;