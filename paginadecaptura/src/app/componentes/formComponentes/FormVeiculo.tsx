import React from "react";
import { Grid, TextField, Button } from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Schema } from "./schema";
import { FormNumberProps } from "./FormResidentes";
import { Titulo } from "./titulo";

export const FormVeiculo: React.FC<FormNumberProps> = ({ index }) => {
    const { control, register, formState: { errors } } = useFormContext<Schema>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "veiculos"
    });

    return (
        <>
            <Titulo titulo="Veículos" />
            {
                fields.map((field, index) => (
                    <Grid container key={field.id} spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                {...register(`veiculos.${index}.modelo` as const)}
                                label="Modelo do Veículo"
                                fullWidth
                                error={!!errors.veiculos?.[index]?.modelo}
                                helperText={errors.veiculos?.[index]?.modelo?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                {...register(`veiculos.${index}.cor` as const)}
                                label="Cor do Veículo"
                                fullWidth
                                error={!!errors.veiculos?.[index]?.cor}
                                helperText={errors.veiculos?.[index]?.cor?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                {...register(`veiculos.${index}.placa` as const)}
                                label="Placa do Veículo"
                                fullWidth
                                error={!!errors.veiculos?.[index]?.placa}
                                helperText={errors.veiculos?.[index]?.placa?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button variant="outlined" onClick={() => remove(index)}>Remover</Button>
                        </Grid>
                    </Grid>
                ))
            }

            <Grid item xs={12} sx={{ mt: 3, mb: 1, display: "flex", justifyContent: "space-around" }}>
                <Button
                    onClick={() => append({ modelo: "", cor: "", placa: "" })}
                    variant="contained">
                    Adicionar Veículo
                </Button>
            </Grid >
        </>
    );
};
