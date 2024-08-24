import React from "react";
import { Grid, TextField, Button, FormControlLabel, Checkbox, RadioGroup, Radio } from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Schema } from "./schema";
import { Titulo } from "./FormTitular";

export interface FormNumberProps {
    index: number;
}

export const FormResidente: React.FC<FormNumberProps> = ({ index }) => {
    const { register, control, formState: { errors } } = useFormContext<Schema>();
    const { append, fields, remove } = useFieldArray({
        control,
        name: "residentes"
    });

    return (
        <>
            <Titulo titulo="Residentes" />
            {fields.map((field, index) => (
                <Grid container spacing={2} key={field.id} className={`${index != 0 ? 'mt-10' : ''}`}>
                    {/* <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...register(`residentes.${index}.tipoCadastro` as const)}
                                    color="primary"
                                />
                            }
                            label="Tipo de Cadastro"
                        />
                        {errors.residentes?.[index]?.tipoCadastro && (
                            <p className="text-xs pt-1 text-red-600 text-center">{errors.residentes?.[index]?.tipoCadastro?.message}</p>
                        )}
                    </Grid> */}
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
                        <RadioGroup
                            {...register(`residentes.${index}.tipoDocumento` as const)}
                            row
                        >
                            <FormControlLabel value="RG" control={<Radio />} label="RG" />
                            <FormControlLabel value="CPF" control={<Radio />} label="CPF" />
                            <FormControlLabel value="CNH" control={<Radio />} label="CNH" />
                        </RadioGroup>
                        {errors.residentes?.[index]?.tipoDocumento && (
                            <p className="text-xs pt-1 text-red-600 text-center">{errors.residentes?.[index]?.tipoDocumento?.message}</p>
                        )}
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
                    {index !== 0 && (
                        <>
                            <Grid item xs={12} md={6} className="primeiro-item">
                                <TextField
                                    {...register(`residentes.${index}.parentesco` as const)}
                                    label="Parentesco"
                                    fullWidth
                                    error={!!errors.residentes?.[index]?.parentesco}
                                    helperText={errors.residentes?.[index]?.parentesco?.message}
                                />
                            </Grid>
                            < Grid item xs={12} sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => remove(index)}
                                >
                                    Remover
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid >
            ))}
            <Grid item xs={12} sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}>
                <Button
                    onClick={() => append({ tipoCadastro: "Novo cadastro", nome: "", telefone: "", email: "", tipoDocumento: "RG", documento: "", parentesco: "" })}
                    variant="contained"
                >
                    Adicionar Residente
                </Button>
            </Grid>
        </>
    );
};
