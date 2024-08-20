import { z } from 'zod';

const patterns = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    rg: /^\d{2}\.\d{3}\.\d{3}-\d{1}$/,
    cnh: /^\d{11}$/
};

const zodSchema = z.object({
    nome: z.string().min(7, { message: 'Digite seu nome completo' }),
    telefone: z.string().min(10, { message: 'Digite um telefone válido' }),
    email: z.string().min(1, { message: 'Insira um email' })
        .refine((text) => patterns.email.test(text), { message: "O email é inválido" }),
    tipoDocumento: z.enum(["RG", "CPF", "CNH"], { message: 'Selecione um tipo de documento válido' }),
    documento: z.string().min(10, { message: 'Digite somente os números do documento' }),
    parentesco: z.string().optional(),
    residentes: z.array(
        z.object({
            nome: z.string().min(7, { message: 'Digite seu nome completo' }),
            telefone: z.string().min(10, { message: 'Digite um telefone válido' }),
            email: z.string().min(1, { message: 'Insira um email' })
                .refine((text) => patterns.email.test(text), { message: "O email é inválido" }),
            tipoDocumento: z.enum(["RG", "CPF", "CNH"], { message: 'Selecione um tipo de documento válido' }),
            documento: z.string().min(10, { message: 'Digite somente os números do documento' }),
            parentesco: z.string().min(1).max(1),
        }))
        // .refine((data) => {
        //     if (data.tipoDocumento === "CPF") {
        //         return patterns.cpf.test(data.documento);
        //     } else if (data.tipoDocumento === "RG") {
        //         return patterns.rg.test(data.documento);
        //     } else if (data.tipoDocumento === "CNH") {
        //         return patterns.cnh.test(data.documento);
        //     }
        //     return false;
        // }, {
        //     message: "Documento inválido para o tipo selecionado",
        //     path: ["documento"]
        // }),
});

export type Schema = z.infer<typeof zodSchema>;

export const schema = zodSchema;
