import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const InputKit = React.forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full p-2 border rounded ${className}`}
        {...props}
      />
    );
  }
);

InputKit.displayName = "InputKit";

export default InputKit;
