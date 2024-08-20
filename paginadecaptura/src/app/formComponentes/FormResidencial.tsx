import { Autocomplete, RadioGroup, FormControlLabel, Radio, Grid, TextField } from "@mui/material";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { FormSchemaType } from "./schema";
import { z } from 'zod';


interface FormResidentProps {
    index: number;
}

export const FormResident = ({ index }: FormResidentProps) => {
    const { control, register, formState: { errors } } = useFormContext<FormSchemaType>();
    
    const { fields, append, remove } = useFieldArray({
        control,
        nome: "residentes"
    });

    return (
        <Grid container spacing={2} sx={{ mx: "2rem", width: "90%", m: "auto" }}>
            <Grid item xs={12} md={6}>
                <TextField 
                    {...register(`residentes.${index}.nome`)}
                    label="Nome e Sobrenome" 
                    fullWidth 
                    error={!!errors.residentes?.[index]?.nome} 
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField 
                    {...register(`residentes.${index}.telefone`)} 
                    label="Telefone" 
                    fullWidth 
                    error={!!errors.residentes?.[index]?.telefone} 
                    helperText={errors.residentes?.[index]?.telefone?.message} 
                />
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    {...register(`residentes.${index}.email`)} 
                    label="Email" 
                    fullWidth 
                    error={!!errors.residentes?.[index]?.email} 
                    helperText={errors.residentes?.[index]?.email?.message} 
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    options={[
                        { id: "1", value: "Pai" },
                        { id: "2", value: "Mãe" },
                        { id: "3", value: "Filho(a)" },
                        { id: "4", value: "Tio(a)" },
                        { id: "5", value: "Primo(a)" },
                        { id: "6", value: "Avós" },
                        { id: "7", value: "Amigo(a)" },
                        { id: "8", value: "Locatário(a)" },
                        { id: "9", value: "Proprietário(a)" },
                        { id: "10", value: "Arrendatário(a)" },
                        { id: "11", value: "Funcionário(a)" },
                        { id: "12", value: "Diarista" },
                        { id: "13", value: "Outro" },
                    ]}
                    getOptionLabel={(option) => option.value}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => <TextField {...params} label="Nível de parentesco" fullWidth />}
                    {...register(`residentes.${index}.parentesco`)} 
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <Controller
                    name={`residentes.${index}.tipoDocumento`}
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
                    {...register(`residentes.${index}.documento`)} 
                    label="Número do Documento" 
                    fullWidth 
                    error={!!errors.residentes?.[index]?.documento} 
                    helperText={errors.residentes?.[index]?.documento?.message} 
                />
            </Grid>
        </Grid>
    );
};
