'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import changeUserDescription from '@/services/api/settings/changeUserDescription';
import useSession from '@/services/hooks/auth/useSession';
import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/zod';

const formSchema = z.object({
    description: z.string().max(256).nullable(),
});

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    const { user: loggedUser } = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: loggedUser?.description,
        },
    });

    const mutation = useMutation({
        mutationFn: changeUserDescription,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            closeModal();
            enqueueSnackbar(
                'Ви успішно змінили загальні налаштування профілю.',
                { variant: 'success' },
            );
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutation.mutate({
            params: data,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col gap-6 p-6"
            >
                <FormTextarea
                    name="description"
                    placeholder="Введіть опис"
                    label="Опис"
                />
                <Button
                    disabled={mutation.isPending}
                    variant="default"
                    type="submit"
                    className="w-full"
                >
                    {mutation.isPending && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </Button>
            </form>
        </Form>
    );
};

export default Component;
