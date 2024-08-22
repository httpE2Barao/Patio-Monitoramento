import { Grid, TextField, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { Residente, Schema } from "./schema";

// Componente para título
export const Titulo = (props: { titulo: string }) => {
    return (
        <Grid item xs={12}>
            <Typography sx={{
                fontSize: {
                    xs: "2rem",
                    sm: "2.4rem",
                    md: "2.4rem",
                    lg: "2.4rem",
                    xl: "2.4rem",
                },
                fontWeight: 500,
                textAlign: "left",
                color: "black",
                py: "1vw",
            }}>
                {props.titulo}
            </Typography>
        </Grid>
    );
};

// Componente do formulário do titular
export const FormTitular = () => {
    const { control, register, formState: { errors } } = useFormContext<Residente>();

    return (
        <Grid container spacing={2} sx={{ pb: 2, mx: "2rem", width: "90%", m: "auto" }}>

            <Titulo titulo="Residencial" />

            <Grid item xs={12}>
                <Controller
                    name="tipoCadastro"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup {...field} sx={{ gap: "1rem", display: "flex", flexDirection: "row" }}>
                            <FormControlLabel value="Cadastrado" control={<Radio />} label="Já possuo cadastro" />
                            <FormControlLabel value="Novo cadastro" control={<Radio />} label="Sou novo morador" />
                        </RadioGroup>
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register("nome")}
                    label="Nome e Sobrenome"
                    fullWidth
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register("telefone")}
                    label="Telefone"
                    fullWidth
                    error={!!errors.telefone}
                    helperText={errors.telefone?.message}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    {...register("email")}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <Controller
                    name="tipoDocumento"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup {...field} sx={{ gap: "1rem", display: "flex", flexDirection: "row", pt: 1, justifyContent: "center" }}>
                            <FormControlLabel value="RG" control={<Radio />} label="RG" />
                            <FormControlLabel value="CPF" control={<Radio />} label="CPF" />
                            <FormControlLabel value="CNH" control={<Radio />} label="CNH" />
                        </RadioGroup>
                    )}
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <TextField
                    {...register("documento")}
                    label="Número do Documento"
                    fullWidth
                    error={!!errors.documento}
                    helperText={errors.documento?.message}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    {...register("condominio")}
                    label="Condomínio"
                    fullWidth
                    error={!!errors.condominio}
                    helperText={errors.condominio?.message}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    {...register("apto")}
                    label="Apartamento"
                    fullWidth
                    error={!!errors.apto}
                    helperText={errors.apto?.message}
                />
            </Grid>
        </Grid>
    );
};
