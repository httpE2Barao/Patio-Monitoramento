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
                        {...register(`endereco.condominio` as const)}
                        label="Condomínio"
                        fullWidth
                        error={!!errors.endereco?.condominio}
                        helperText={errors.endereco?.condominio?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        {...register(`endereco.apto` as const)}
                        label="Apartamento"
                        fullWidth
                        error={!!errors.endereco?.apto}
                        helperText={errors.endereco?.apto?.message}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
