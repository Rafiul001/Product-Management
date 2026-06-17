import { Button, Spinner } from "@heroui/react";
import type React from "react";

type Props = {
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  disabled?: boolean;
};

const SaveCancelBar: React.FC<Props> = ({
  onSave,
  onCancel,
  saving,
  disabled,
}) => (
  <div className="flex gap-2 pt-1">
    <Button
      onPress={onSave}
      isDisabled={saving || disabled}
      variant="primary"
      size="sm"
    >
      {saving && <Spinner size="sm" />}
      Save
    </Button>
    <Button onPress={onCancel} isDisabled={saving} variant="ghost" size="sm">
      Cancel
    </Button>
  </div>
);

export default SaveCancelBar;
