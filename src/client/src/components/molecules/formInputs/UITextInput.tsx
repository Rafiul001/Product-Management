import { Input, Label, Text } from "@heroui/react";
import React from "react";

interface IUITextInputProps extends React.ComponentPropsWithRef<typeof Input> {
  label?: string;
  error?: string;
}

const UITextInput = React.forwardRef<HTMLInputElement, IUITextInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <Input ref={ref} {...props} />
        {error && (
          <Text className="text-xs text-danger-500 block">{error}</Text>
        )}
      </div>
    );
  },
);

UITextInput.displayName = "UITextInput";

export default UITextInput;
