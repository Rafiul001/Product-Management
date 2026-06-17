import { Input, Label, Text } from "@heroui/react";
import React from "react";

interface IUIFileInputProps extends Omit<
  React.ComponentPropsWithRef<typeof Input>,
  "type"
> {
  label?: string;
  error?: string;
}

const UIFileInput = React.forwardRef<HTMLInputElement, IUIFileInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <Input ref={ref} type="file" {...props} />
        {error && (
          <Text className="text-xs text-danger-500 block">{error}</Text>
        )}
      </div>
    );
  },
);

UIFileInput.displayName = "UIFileInput";

export default UIFileInput;
