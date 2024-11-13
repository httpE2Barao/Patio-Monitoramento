"use client"
import { Autocomplete, Button, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Schema } from "../../app/api/schema-zod";
import { Titulo } from "./titulo";

export interface FormNumberProps {
    index: number;
}

export const FormResidentes: React.FC<FormNumberProps> = ({ index }) => {
    const { control, register, formState: { errors } } = useFormContext<Schema>();
    const { append, fields, remove } = useFieldArray({
      control,
      name: "residentes"
    });

    const [parentescos, setParentescos] = useState<{ id: number, value: string }[]>([]);

    useEffect(() => {
        fetch("/parentescos.json")
            .then(res => (res.json()))
            .then(data => setParentescos(data))
            .catch(err => console.error("Erro ao carregar os parentescos:", err))
    }, []);

    return (
        <>
            <Titulo titulo="Residentes" />
            {fields.map((field, index) => (
                <Grid container spacing={2} key={field.id} className={`${index != 0 ? 'mt-10' : ''}`}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            {...register(`residentes.${index}.nome` as const)}
                            label="Nome"
                            fullWidth
                            error={!!errors.residentes?.[index]?.nome}
                            helperText={errors.residentes?.[index]?.nome?.message}
                        />
                    </Grid>
                    {index !== 0 && (
                        <>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name={`residentes.${index}.parentesco`}
                                    control={control}
                                    rules={{ required: "O campo de parentesco é obrigatório" }}
                                    render={({ field: { value, ...field } }) => (
                                        <Autocomplete
                                            {...field}
                                            options={parentescos}
                                            getOptionLabel={(option) => option.value}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            onChange={(event, newValue) => {
                                                field.onChange(newValue?.value || "");
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Nível de parentesco" fullWidth />}
                                        />
                                    )}
                                />
                                {errors.residentes?.[index]?.parentesco && (
                                    <p className="text-xs pt-1 text-red-600 pl-4">{errors.residentes?.[index]?.parentesco?.message}</p>
                                )}
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12} md={6}>
                        <TextField
                            {...register(`residentes.${index}.telefone` as const)}
                            label="Telefone"
                            fullWidth
                            error={!!errors.residentes?.[index]?.telefone}
                            helperText={errors.residentes?.[index]?.telefone?.message}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className={`${index == 0 && 'grid-row-span-2'}`}>
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
                            {...register(`residentes.${index}.documento` as const)}
                            label="Documento"
                            fullWidth
                            error={!!errors.residentes?.[index]?.documento}
                        // helperText={errors.residentes?.[index]?.documento?.message}
                        />
                        <Controller
                            name={`residentes.${index}.tipoDocumento`}
                            control={control}
                            rules={{ required: 'Selecione um tipo de documento válido' }}
                            render={({ field }) => (
                                <RadioGroup {...field} row sx={{ justifyContent: "space-around" }}
                                // onChange={(event, newValue) => { field.onChange(newValue?.value || ""); }}
                                >
                                    <FormControlLabel value="RG" control={<Radio />} label="RG" />
                                    <FormControlLabel value="CPF" control={<Radio />} label="CPF" />
                                    <FormControlLabel value="CNH" control={<Radio />} label="CNH" />
                                </RadioGroup>
                            )}
                        />
                        {errors.residentes?.[index]?.tipoDocumento && (
                            <p className="text-xs pt-1 text-red-600 pl-4">{errors.residentes?.[index]?.tipoDocumento?.message}</p>
                        )}
                    </Grid>
                    {index !== 0 && (
                        <>
                            < Grid item xs={12} sx={{ display: "flex", justifyContent: "space-around" }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => remove(index)}
                                    className="mr-auto"
                                >
                                    Remover
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid >
            ))}
            <Grid item xs={12} sx={{ mt: 3, mb: 1, display: "flex", justifyContent: "space-around" }}>
                <Button
                    onClick={() => append({ nome: "", telefone: "", email: "", tipoDocumento: "RG", documento: "", parentesco: "" })}
                    variant="contained"
                >
                    Adicionar Residente
                </Button>
            </Grid>
        </>
    );
};
