import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import i18n from '@/src/config/i18n';
import { useTranslation } from 'react-i18next';
import { Event } from '@/src/domain/Event';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { LoaderCircle, Rocket } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFingerprint } from '@/src/hooks/useFingerprint';
import { useCreateUserMutation } from '@/src/hooks/useCreateUserMutation';
import { STORAGE_USER_ID_KEY } from '@/src/hooks/useUserId';
import { toast } from 'sonner';

const PromptFormSchema = z.object({
  nickname: z.string().nonempty({ message: i18n.t('empty-nickname-error') }),
  email: z
    .string()
    .email({ message: i18n.t('invalid-email-error') })
    .nonempty({ message: i18n.t('empty-email-error') }),
  allowContact: z
    .string()
    .nonempty({ message: i18n.t('empty-allow-contact-error') }),
});

type EventPromptFormProps = {
  event: Event;
};

export const UserInfoForm = ({ event }: EventPromptFormProps) => {
  const { t } = useTranslation();

  const fingerprint = useFingerprint();

  const { mutateAsync: createUser, isPending } = useCreateUserMutation();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PromptFormSchema>>({
    resolver: zodResolver(PromptFormSchema),
    defaultValues: {
      nickname: '',
      email: '',
      allowContact: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof PromptFormSchema>) => {
    try {
      const { id: userId } = await createUser({
        userEmail: data.email,
        userNickname: data.nickname,
        allowContact: data.allowContact === 'true',
        browserFingerprint: fingerprint,
      });

      sessionStorage.setItem(STORAGE_USER_ID_KEY, userId);

      navigate(`/events/${event.id}/image-generation`);
    } catch (e) {
      toast.error(`Failed to create user: ${(e as Error).message}`);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>
          {t('ends')}: {format(event.endDate, 'dd/MM/yyyy HH:mm')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-2 mb-6">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('nickname')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email-address')}</FormLabel>
                    <FormControl>
                      <Input placeholder="doe.john@sfeir.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="allowContact"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="mb-4 block">
                    {t('allow-contact')}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-16"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="false" className="my-0" />
                        </FormControl>
                        <FormLabel>{t('no')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="true" className="my-0" />
                        </FormControl>
                        <FormLabel>{t('yes')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-4" type="submit" disabled={isPending}>
              {isPending ? (
                <LoaderCircle
                  className="animate-spin"
                  data-testid="loader-circle"
                />
              ) : (
                <Rocket />
              )}
              <span>{t('go-to-image-generation')}</span>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
