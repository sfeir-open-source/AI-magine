import { Logo } from '@/src/components/logo';
import { SfeirEventsList } from '@/src/components/sfeir-events-list';
import { useTranslations } from '@/src/hooks/use-translations';

export const HomePage = () => {
  const { t } = useTranslations();
  return (
    <>
      <Logo />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {t('greetings', { name: 'John Doe' })}
      </h1>
      <SfeirEventsList />
    </>
  );
};
