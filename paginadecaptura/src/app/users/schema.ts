import { z } from 'zod';

const patterns = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

export const schema = z.object({
    nome: z.string().min(7, { message: 'Digite seu nome completo' }),
    email: z.string().min(1, { message: 'Email is required' })
        .refine((text) => patterns.email.test(text), {message: "O email é inválido"}),
    parentesco: z.array(z.string().min(1).max(1)),
})

export type Schema = z.infer<typeof schema>
