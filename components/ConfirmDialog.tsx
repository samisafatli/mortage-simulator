import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import { TEXTS } from '@/constants/texts';
import { useAppTheme } from '@/constants/theme';

type ConfirmDialogProps = Readonly<{
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onDismiss: () => void;
  destructive?: boolean;
}>;

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onDismiss,
  destructive = false,
}: ConfirmDialogProps) {
  const theme = useAppTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>{TEXTS.BUTTON_CANCEL}</Button>
          <Button onPress={onConfirm} textColor={destructive ? theme.colors.error : undefined}>
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
