import React from "react";

type IntegerInputProps = {
  /* Unfortunately, allowing strings seems like the most common approach
   * for dealing with empty values. I tried implementing this in such a way
   * that values could be strictly numbers, but it seemed a lot like a hacky
   * workaround. It involved storing a string representation of the value in
   * this component's state, and it relied on getDerivedStateFromProps lifecycle
   * method for updating internal state whenever the prop value changed (this also
   * involved keeping track of when user has focus on the <input> field so that
   * we could know if the prop change came from parent (for example from a slider),
   * or if it was a result of user typing some text in the <input> field).
   * It seemed to work fine, but I was not happy with having workarounds for such a
   * simple component that's meant to just display an <input> field that supports only
   * numbers... so, just be aware that an empty string might be passed through
   * the onValueChange callback.
   */
  value: number | string;
  onValueChange: (newValue: number | string, inputName?: string) => void;

  min: number;
  max: number;

  id?: string;
  name?: string;
  placeholder?: string;
};

/* Prevents users from typing anything that is not a digit, while also
 * providing a reasonable user experience when it comes to validating
 * that the number is within a [min, max] range. The number will get adjusted
 * to fit that range when <input> field loses focus, so that user doesn't
 * get confused when we replace what he's typing right away.
 */
const IntegerInput: React.FC<IntegerInputProps> = (props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const digitsOnly = event.target.value.replace(/[^0-9]/g, "");
    if (digitsOnly && digitsOnly.length > 0) {
      props.onValueChange(Number(digitsOnly), props.name);
    } else {
      props.onValueChange("", props.name);
    }
  };

  const handleLostFocus = (): void => {
    if (props.value < props.min) {
      props.onValueChange(props.min, props.name);
    } else if (props.value > props.max) {
      props.onValueChange(props.max, props.name);
    }
  };

  return (
    <input
      id={props.id}
      name={props.name}
      onBlur={handleLostFocus}
      onChange={handleChange}
      placeholder={props.placeholder}
      spellCheck="false"
      type="text"
      value={props.value}
    ></input>
  );
};

export default IntegerInput;
