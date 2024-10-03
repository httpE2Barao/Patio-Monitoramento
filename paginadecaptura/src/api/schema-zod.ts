import { z } from 'zod';

const patterns = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

const residenteSchema = z.object({
    nome: z.string().min(7, { message: 'Digite seu nome completo' }),
    telefone: z.string().min(10, { message: 'Digite um telefone válido' }),
    email: z.string().min(1, { message: 'Insira um email' })
        .refine((text) => patterns.email.test(text), { message: "O email é inválido" }),
    tipoDocumento: z.enum(["RG", "CPF", "CNH"], { message: 'Selecione um tipo de documento válido' }),
    documento: z.string().min(9, { message: 'Digite somente os números do documento' }).max(11, { message: 'Digite somente os números do documento' }),
    parentesco: z.string().min(1, { message: 'Selecione um nível de parentesco' }).optional(),
});

const enderecoSchema = z.object({
    condominio: z.string().min(1, { message: 'Digite o nome do condomínio' }),
    apto: z.string().min(1, { message: 'Digite o número do apartamento' }),
});

const veiculoSchema = z.object({
    cor: z.string().min(1, { message: 'Digite a cor do carro' }),
    modelo: z.string().min(1, { message: 'Digite o modelo do carro' }),
    placa: z.string().min(7, { message: 'Digite a placa do carro' }),
});

const feedbackSchema = z.string().max(200, { message: 'Digite um feedback' });

export const schema = z.object({
    endereco: z.array(enderecoSchema),
    residentes: z.array(residenteSchema),
    veiculos: z.array(veiculoSchema),
    feedback: z.string(feedbackSchema)
  });

export type Endereco = z.infer<typeof enderecoSchema>;
export type Residente = z.infer<typeof residenteSchema>;
export type Veiculo = z.infer<typeof veiculoSchema>;
export type Feedback = z.infer<typeof feedbackSchema>;
export type Schema = z.infer<typeof schema>;