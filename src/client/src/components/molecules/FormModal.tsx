import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import type React from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formId: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  submitLoadingLabel?: string;
  onClose?: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  scrollable?: boolean;
};

const FormModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  title,
  formId,
  isSubmitting = false,
  submitLabel = "Save",
  submitLoadingLabel,
  onClose,
  children,
  size,
  scrollable = false,
}) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Backdrop>
      <Modal.Container placement="center" size={size}>
        <Modal.Dialog
          className={scrollable ? "max-h-[90vh] overflow-y-auto" : undefined}
        >
          <ModalHeader>
            {title}
            <Modal.CloseTrigger />
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button
              variant="danger-soft"
              onPress={() => {
                onClose?.();
                onOpenChange(false);
              }}
            >
              Close
            </Button>
            <Button
              type="submit"
              form={formId}
              variant="primary"
              isDisabled={isSubmitting}
            >
              {isSubmitting
                ? (submitLoadingLabel ?? `${submitLabel}ing...`)
                : submitLabel}
            </Button>
          </ModalFooter>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </Modal>
);

export default FormModal;
