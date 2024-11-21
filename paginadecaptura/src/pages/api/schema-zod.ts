import { z } from 'zod';

// Padrões de validação
export const patterns = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

// Função de validação de CPF
const isValidCPF = (cpf: string): boolean => {
    if (!/^[0-9]{11}$/.test(cpf)) return false;
    cpf = cpf.replace(/[\s.-]/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
};

// Esquema base de validação para residente
export const residenteBaseSchema = z.object({
    nome: z.string().min(7, { message: 'Digite seu nome completo' }),
    telefone: z.string().min(10, { message: 'Digite um telefone válido' }),
    email: z.string().min(1, { message: 'Insira um email' })
        .refine((text) => patterns.email.test(text), { message: "O email é inválido" }),
    tipoDocumento: z.enum(["RG", "CPF", "CNH"], { message: 'Selecione um tipo de documento válido' }),
    documento: z.string(),
    parentesco: z.string().optional(),
}).superRefine((values, ctx) => {
    const documentoLimpo = values.documento.replace(/[\s.-]/g, '');

    if (values.tipoDocumento === "CPF") {
        if (!isValidCPF(documentoLimpo)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CPF inválido",
                path: ["documento"],
            });
        }
    } else if (values.tipoDocumento === "RG" || values.tipoDocumento === "CNH") {
        if (documentoLimpo.length < 9 || documentoLimpo.length > 11) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Documento inválido, deve ter no mínimo 9 caracteres",
                path: ["documento"],
            });
        }
    }
});

// Esquema final de residente
export const residenteSchema = residenteBaseSchema;

// Esquema de validação para endereço
export const enderecoSchema = z.object({
    condominio: z.string().nonempty('Selecione um condomínio'),
    apto: z.string().min(1, { message: 'Digite o número e o bloco do apartamento' }),
});

// Esquema de validação para veículo
export const veiculoSchema = z.object({
    cor: z.string().min(3, { message: 'Digite a cor do carro' }),
    modelo: z.string().min(3, { message: 'Digite o modelo do carro' }),
    placa: z.string().min(7, { message: 'Digite a placa do carro' }),
});

// Esquema de validação para feedback
export const feedbackSchema = z.string().max(100, { message: 'Digite um feedback' }).optional();

// Esquema geral de validação
export const schema = z.object({
    endereco: enderecoSchema,
    residentes: z.array(residenteSchema),
    veiculos: z.array(veiculoSchema),
    feedback: feedbackSchema,
});

// Tipos inferidos a partir dos esquemas
export type Endereco = z.infer<typeof enderecoSchema>;
export type Residente = z.infer<typeof residenteSchema>;
export type Veiculo = z.infer<typeof veiculoSchema>;
export type Feedback = z.infer<typeof feedbackSchema>;
export type Schema = z.infer<typeof schema>;