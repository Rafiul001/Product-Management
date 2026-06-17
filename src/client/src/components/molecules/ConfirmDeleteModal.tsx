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
  message: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
};

const ConfirmDeleteModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
  isLoading = false,
}) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Backdrop>
      <Modal.Container placement="center">
        <Modal.Dialog>
          <ModalHeader>
            {title}
            <Modal.CloseTrigger />
          </ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button variant="danger" onPress={onConfirm} isDisabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </ModalFooter>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </Modal>
);

export default ConfirmDeleteModal;
