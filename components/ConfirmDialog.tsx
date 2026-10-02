import React from 'react';
import { Dialog, Portal, Paragraph, Button } from 'react-native-paper';

type AlertDialogProps = {
    visible: boolean;
    message: string;
    onClose: () => void;
    title?: string;
};

export default function AlertDialog({ visible, message, onClose, title = "Atenção" }: AlertDialogProps) {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>{message}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
