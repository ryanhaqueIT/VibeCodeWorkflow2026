import React, { useRef, useCallback } from 'react';
import type { Theme } from '../types';
import { MODAL_PRIORITIES } from '../constants/modalPriorities';
import { Modal, ModalFooter } from './ui/Modal';

interface ConfirmModalProps {
  theme: Theme;
  message: string;
  onConfirm: (() => void) | null;
  onClose: () => void;
}

export function ConfirmModal({ theme, message, onConfirm, onClose }: ConfirmModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  }, [onConfirm, onClose]);

  return (
    <Modal
      theme={theme}
      title="Confirm Action"
      priority={MODAL_PRIORITIES.CONFIRM}
      onClose={onClose}
      width={450}
      zIndex={10000}
      initialFocusRef={confirmButtonRef}
      footer={
        <ModalFooter
          theme={theme}
          onCancel={onClose}
          onConfirm={handleConfirm}
          destructive
          confirmButtonRef={confirmButtonRef}
        />
      }
    >
      <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMain }}>
        {message}
      </p>
    </Modal>
  );
}
