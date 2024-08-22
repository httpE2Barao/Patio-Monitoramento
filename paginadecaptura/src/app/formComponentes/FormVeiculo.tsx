import React from "react";
import { Grid, TextField, Button } from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Schema } from "./schema";

export const FormVeiculo = (props: { index: number }) => {
    const { control, register, formState: { errors } } = useFormContext<Schema>();
    const { fields, append } = useFieldArray({
        control,
        name: "veiculos"
    });

    return (
        <Grid container spacing={3} sx={{ py: 2, borderTop: "1px solid grey" }}>
            {fields.map((field, index) => (
                <Grid container key={field.id} spacing={2}>
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
                </Grid>
            ))}
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                    onClick={() => append({ cor: "", modelo: "", placa: "" })}
                    variant="contained"
                >
                    Adicionar Veículo
                </Button>
            </Grid>
        </Grid>
    );
};
