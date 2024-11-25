import { Autocomplete, Button, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Schema } from "../../pages/api/schema-zod";
import { Titulo } from "./titulo";

export interface FormNumberProps {
    index: number;
}

export const FormResidentes: React.FC<FormNumberProps> = () => {
    const { control, register, formState: { errors }, setValue, getValues } = useFormContext<Schema>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "residentes"
    });

    const [parentescos, setParentescos] = useState<{ id: number, value: string }[]>([]);

    useEffect(() => {
        fetch("/parentescos.json")
            .then(res => res.json())
            .then(data => setParentescos(data))
            .catch(err => console.error("Erro ao carregar os parentescos:", err));
    }, []);

    return (
        <>
            <Titulo titulo="Residentes" />
            {fields.map((field, index) => {
                const [telefones, setTelefones] = useState<string[]>(getValues(`residentes.${index}.telefone`) || [""]);

                const handleAddTelefone = () => {
                    if (telefones.length < 3) {
                        const newTelefones = [...telefones, ""];
                        setTelefones(newTelefones);
                        setValue(`residentes.${index}.telefone`, newTelefones);
                    }
                };

                const handleRemoveTelefone = (phoneIndex: number) => {
                    const newTelefones = telefones.filter((_, idx) => idx !== phoneIndex);
                    setTelefones(newTelefones);
                    setValue(`residentes.${index}.telefone`, newTelefones);
                };

                const handleTelefoneChange = (phoneIndex: number, value: string) => {
                    const newTelefones = telefones.map((telefone, idx) =>
                        idx === phoneIndex ? value : telefone
                    );
                    setTelefones(newTelefones);
                    setValue(`residentes.${index}.telefone`, newTelefones);
                };

                return (
                    <Grid container spacing={2} key={field.id}>
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
                        )}
                        <Grid item xs={12} md={6}>
                            {telefones.map((telefone, phoneIndex) => (
                                <div key={phoneIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <TextField
                                        label={`Telefone ${phoneIndex + 1}`}
                                        fullWidth
                                        value={telefone}
                                        onChange={(e) => handleTelefoneChange(phoneIndex, e.target.value)}
                                        error={!!errors.residentes?.[index]?.telefone?.[phoneIndex]}
                                        helperText={errors.residentes?.[index]?.telefone?.[phoneIndex]?.message}
                                    />
                                    {telefones.length < 3 && phoneIndex === telefones.length - 1 && (
                                        <Button
                                            variant="text"
                                            onClick={handleAddTelefone}
                                            style={{ marginLeft: '8px', minWidth: '40px' }}
                                        >
                                            +
                                        </Button>
                                    )}
                                    {telefones.length > 1 && (
                                        <Button
                                            variant="text"
                                            onClick={() => handleRemoveTelefone(phoneIndex)}
                                            style={{ marginLeft: '8px', minWidth: '40px' }}
                                        >
                                            -
                                        </Button>
                                    )}
                                </div>
                            ))}
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
                            <TextField
                                {...register(`residentes.${index}.documento` as const)}
                                label="Documento"
                                fullWidth
                                error={!!errors.residentes?.[index]?.documento}
                                helperText={errors.residentes?.[index]?.documento?.message}
                            />
                            <Controller
                                name={`residentes.${index}.tipoDocumento`}
                                control={control}
                                rules={{ required: 'Selecione um tipo de documento válido' }}
                                render={({ field }) => (
                                    <RadioGroup {...field} row sx={{ justifyContent: "space-around" }}>
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
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-around" }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => remove(index)}
                                    className="mr-auto"
                                >
                                    Remover
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                );
            })}
            <Grid item xs={12} sx={{ mt: 3, mb: 1, display: "flex", justifyContent: "space-around" }}>
                <Button
                    onClick={() => append({ nome: "", telefone: [""], email: "", tipoDocumento: "RG", documento: "", parentesco: "" })}
                    variant="contained"
                >
                    Adicionar Residente
                </Button>
            </Grid>
        </>
    );
};
