import React from "react";
import { Grid, TextField, Button } from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Schema } from "./schema";

interface FormResidenteProps {
    index: number;
}

export const FormResidente: React.FC<FormResidenteProps> = ({ index }) => {
    const { register, control, formState: { errors } } = useFormContext<Schema>();
    const { append, fields, remove } = useFieldArray({
        name: "residentes",
        control
    });


    return (
        <Grid container spacing={2} key={fields[index].id}>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.tipoCadastro` as const)}
                    label="Tipo de Cadastro"
                    fullWidth
                    error={!!errors.residentes?.[index]?.tipoCadastro}
                    helperText={errors.residentes?.[index]?.tipoCadastro?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.nome` as const)}
                    label="Nome"
                    fullWidth
                    error={!!errors.residentes?.[index]?.nome}
                    helperText={errors.residentes?.[index]?.nome?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.telefone` as const)}
                    label="Telefone"
                    fullWidth
                    error={!!errors.residentes?.[index]?.telefone}
                    helperText={errors.residentes?.[index]?.telefone?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.email` as const)}
                    label="Email"
                    fullWidth
                    error={!!errors.residentes?.[index]?.email}
                    helperText={errors.residentes?.[index]?.email?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.tipoDocumento` as const)}
                    label="Tipo de Documento"
                    fullWidth
                    error={!!errors.residentes?.[index]?.tipoDocumento}
                    helperText={errors.residentes?.[index]?.tipoDocumento?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.documento` as const)}
                    label="Documento"
                    fullWidth
                    error={!!errors.residentes?.[index]?.documento}
                    helperText={errors.residentes?.[index]?.documento?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.parentesco` as const)}
                    label="Parentesco"
                    fullWidth
                    error={!!errors.residentes?.[index]?.parentesco}
                    helperText={errors.residentes?.[index]?.parentesco?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.condominio` as const)}
                    label="Condomínio"
                    fullWidth
                    error={!!errors.residentes?.[index]?.condominio}
                    helperText={errors.residentes?.[index]?.condominio?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register(`residentes.${index}.apto` as const)}
                    label="Apartamento"
                    fullWidth
                    error={!!errors.residentes?.[index]?.apto}
                    helperText={errors.residentes?.[index]?.apto?.message}
                />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                    onClick={() => append({ tipoCadastro: "Cadastrado", nome: "", telefone: "", email: "", tipoDocumento: "RG", documento: "", parentesco: "", condominio: "", apto: "" })}
                    variant="contained"
                >
                    Adicionar Residente
                </Button>
            </Grid>
            <Grid item xs={12} md={6}>
                <Button onClick={() => remove(index)}>Remover</Button>
            </Grid>
        </Grid>
    );
};
