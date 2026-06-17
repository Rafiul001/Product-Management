import { Input, Label, Text } from "@heroui/react";
import React from "react";

interface IUINumberInputProps extends Omit<
  React.ComponentPropsWithRef<typeof Input>,
  "type"
> {
  label?: string;
  error?: string;
}

const UINumberInput = React.forwardRef<HTMLInputElement, IUINumberInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <Input ref={ref} type="number" {...props} />
        {error && (
          <Text className="text-xs text-danger-500 block">{error}</Text>
        )}
      </div>
    );
  },
);

UINumberInput.displayName = "UINumberInput";

export default UINumberInput;
