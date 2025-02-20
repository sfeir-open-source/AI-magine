import React from 'react';
import { Label } from '@/components/ui/label';
import { Logo } from '@/src/components/logo';
import {useTranslations} from "@/src/hooks/use-translations";

export const HomePage = () => {
    const {t} = useTranslations();
  return (
    <>
      <Logo />
      <Label>{t('greetings', {name: 'John Doe'})}</Label>
    </>
  );
};
