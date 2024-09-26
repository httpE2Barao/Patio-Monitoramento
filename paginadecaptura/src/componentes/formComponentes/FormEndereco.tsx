import { Grid, TextField } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Schema } from "../../api/schema-zod";
import { Titulo } from "./titulo";

export const FormEndereco: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<Schema>();

    return (
        <Grid item xs={12}>
            <Titulo titulo="Endereço" />
            <Grid container key={0} spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        {...register(`endereco.0.condominio` as const)}
                        label="Condomínio"
                        fullWidth
                        error={!!errors.endereco?.[0]?.condominio}
                        helperText={errors.endereco?.[0]?.condominio?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        {...register(`endereco.0.apto` as const)}
                        label="Apartamento"
                        fullWidth
                        error={!!errors.endereco?.[0]?.apto}
                        helperText={errors.endereco?.[0]?.apto?.message}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
