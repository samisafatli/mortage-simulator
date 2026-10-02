import { useRouter } from 'expo-router';
import React from 'react';
import { Appbar } from 'react-native-paper';

import { TEXTS } from '@/constants/texts';

type ScreenHeaderProps = Readonly<{
  title: string;
  children?: React.ReactNode;
}>;

/** Appbar com botão de voltar que desempilha a tela (ou vai para a home se não houver histórico). */
export default function ScreenHeader({ title, children }: ScreenHeaderProps) {
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <Appbar.Header mode="small" elevated={false}>
      <Appbar.BackAction onPress={goBack} accessibilityLabel={TEXTS.BUTTON_BACK} />
      <Appbar.Content title={title} />
      {children}
    </Appbar.Header>
  );
}
