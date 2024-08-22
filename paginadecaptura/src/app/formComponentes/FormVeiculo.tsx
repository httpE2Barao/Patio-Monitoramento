import { Grid, TextField } from "@mui/material";
import { Titulo } from "./FormTitular";
import { Schema } from "./schema";
import { useFormContext } from "react-hook-form";

export const FormVeiculo = () => {
    const { register, formState: { errors } } = useFormContext<Schema>();

    return (
        <Grid container spacing={2} sx={{ pb: 2, mx: "2rem", width: "90%", m: "auto" }}>
            <Titulo titulo="Veículo" />

            <Grid item xs={12} md={6}>
                <TextField {...register("veiculo.modelo")} label="Modelo do veículo" fullWidth error={!!errors.veiculo?.modelo} helperText={errors.veiculo?.modelo?.message} />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField {...register("veiculo.cor")} label="Cor do veículo" fullWidth error={!!errors.veiculo?.cor} helperText={errors.veiculo?.cor?.message} />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField {...register("veiculo.placa")} label="Placa do veículo" fullWidth error={!!errors.veiculo?.placa} helperText={errors.veiculo?.placa?.message} />
            </Grid>
        </Grid>
    )
};
