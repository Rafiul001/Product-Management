import { InputGroup, Label, Text } from "@heroui/react";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface IUIPasswordInputProps extends React.ComponentPropsWithRef<
  typeof InputGroup.Input
> {
  label?: string;
  error?: string;
}

const UIPasswordInput = React.forwardRef<
  HTMLInputElement,
  IUIPasswordInputProps
>(({ label, error, ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <InputGroup>
        <InputGroup.Input
          ref={ref}
          type={visible ? "text" : "password"}
          {...props}
        />
        <InputGroup.Suffix>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="flex items-center px-3 text-gray-400 hover:text-gray-600"
          >
            {visible ? (
              <FaEyeSlash className="h-4 w-4" />
            ) : (
              <FaEye className="h-4 w-4" />
            )}
          </button>
        </InputGroup.Suffix>
      </InputGroup>
      {error && <Text className="text-xs text-danger-500 block">{error}</Text>}
    </div>
  );
});

UIPasswordInput.displayName = "UIPasswordInput";

export default UIPasswordInput;
