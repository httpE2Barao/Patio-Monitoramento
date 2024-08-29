import React from "react";
import { Box, Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Schema } from "./schema";
import { Titulo } from "./titulo";

export const FormFeedback: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<Schema>();

    return (
        <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: ".5rem", alignItems: "center", justifyContent: "space-between" }}>
                <Titulo titulo="Feedback" />
                <aside className="text-gray-500">(opcional)</aside>
            </Box>
            <Grid container key={0} spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        {...register(`feedback`)}
                        placeholder="Queremos ouvir você! Deixe-nos saber o que pensa – seja um elogio, sugestão ou desafio que enfrentou. Digite suas palavras neste campo e faça parte da nossa jornada de melhorias!"
                        multiline
                        rows={5}
                        variant="filled"
                        fullWidth
                        error={!!errors.feedback}
                        helperText={errors.feedback?.message}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
