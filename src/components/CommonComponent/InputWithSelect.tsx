import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Select, Input } from "antd";
interface Options {
  label: string;
  value: string;
  placeholder: string;
}
interface InputWithSelectProp {
  options: Array<Options>;
  defaultValue: any;
  inputValue: any;
  hasVoucherId: boolean
}
export default forwardRef(function InputWithSelect(
  props: InputWithSelectProp,
  ref
) {
  const { options, defaultValue, inputValue, hasVoucherId } = props;
  let [placeholder, setPlaceholder] = useState(hasVoucherId ? options[1].placeholder : options[0].placeholder);
  let [value, setValue] = useState(inputValue);
  let [key, setKey] = useState(defaultValue);
  useImperativeHandle(ref, () => {
    return {
      data: {
        key,
        value: value,
      },
    };
  });
  return (
    <>
      <Select
        defaultValue={defaultValue}
        className="width_200 height_32"
        options={options}
        onChange={(v: any) => {
          for (let i = 0; i < options.length; i++) {
            if (v === options[i].value) {
              setPlaceholder(options[i].placeholder);
            }
          }
          setKey(v);
          setValue("");
        }}
      />
      <Input
        placeholder={placeholder}
        value={value}
        className="width_200 border-left-none height_32"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </>
  );
});
