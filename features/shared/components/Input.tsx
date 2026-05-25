import clsx from "clsx";
import React from "react";

const InputContainer = ({ label, children }: {
  label?: string;
  children: React.ReactElement<{
    className: string;
  }>;
}) => (
  <div className="flex flex-col">
    {label && <label className="text-[13px] text-neutral-700">{label}</label>}
    {React.cloneElement(children, {
      className: clsx(
        children.props.className,
        "py-2 px-3 text-sm rounded-lg duration-200 border text-neutral-700 border-neutral-300 focus:border-accent bg-neutral-100"
      )
    })}
  </div>
);

export const Input = ({ type, placeholder, label }: {
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  label?: string;
}) => (
  <InputContainer label={label}>
    <input
      type={type}
      placeholder={placeholder}
    />
  </InputContainer>
);

export const TextArea = ({ placeholder, label }: {
  placeholder?: string;
  label?: string;
}) => (
  <InputContainer label={label}>
    <textarea
      className="resize-none h-28"
      placeholder={placeholder}
    />
  </InputContainer>
);

export const Select = ({ label, children }: {
  label?: string;
  children: React.ReactNode;
}) => (
  <InputContainer label={label}>
    <select className="outline-none">
      {children}
    </select>
  </InputContainer>
);