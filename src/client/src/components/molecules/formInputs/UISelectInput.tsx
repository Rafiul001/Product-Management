import { Label, ListBox, ListBoxItem, Select, Text } from "@heroui/react";
import type React from "react";
import type { Key } from "react-aria-components";

interface ISelectOption {
  label: string;
  value: string | number;
}

interface IUISelectInputProps {
  label?: string;
  error?: string;
  options: ISelectOption[];
  placeholder?: string;
  selectedKey?: string | number | null;
  onSelectionChange?: (key: string) => void;
  className?: string;
  isDisabled?: boolean;
}

const UISelectInput: React.FC<IUISelectInputProps> = ({
  label,
  error,
  options,
  placeholder,
  selectedKey,
  onSelectionChange,
  className,
  isDisabled,
}) => {
  const handleSelectionChange = (key: Key | null) => {
    if (key !== null) onSelectionChange?.(String(key));
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Select
        value={selectedKey}
        onChange={handleSelectionChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        className={className}
      >
        <Select.Trigger className="w-full">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {options.map((opt: ISelectOption) => (
              <ListBoxItem key={opt.value} id={String(opt.value)}>
                {opt.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      {error && <Text className="text-xs text-danger-500 block">{error}</Text>}
    </div>
  );
};

export default UISelectInput;
