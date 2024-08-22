import React from "react";
import { Grid, Button, Container, TextField } from "@mui/material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, Schema } from "./schema";
import { FormResidente } from "./FormResidentes";
import { FormVeiculo } from "./FormVeiculo";
import { Titulo } from "./FormTitular";

export const Form = () => {
    const methods = useForm<Schema>({
        mode: "all",
        resolver: zodResolver(schema),
        defaultValues: {
            residentes: [{ tipoCadastro: 'Cadastrado', nome: '', telefone: '', email: '', tipoDocumento: 'RG', documento: '', parentesco: '', condominio: '', apto: '' }],
            veiculos: [{ cor: '', modelo: '', placa: '' }]
        }
    });

    const { handleSubmit, reset, formState: { errors } } = methods;
    const { fields: residentesFields } = useFieldArray({
        name: "residentes",
        control: methods.control
    });
    const { fields: veiculosFields } = useFieldArray({
        name: "veiculos",
        control: methods.control
    });

    const onSubmit = (data: Schema) => {
        console.log("Form Data:", data);
    };

    return (
        <Container>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}  className="flex gap-2 flex-col items-center justify-evenly">
                    <Grid container spacing={3} sx={{ p: 3 }}>
                        <Grid item xs={12}>
                            <Titulo titulo="Endereço" />
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        {...methods.register("residentes.0.condominio")}
                                        label="Condomínio"
                                        fullWidth
                                        error={!!errors.residentes?.[0]?.condominio}
                                        helperText={errors.residentes?.[0]?.condominio?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        {...methods.register("residentes.0.apto")}
                                        label="Apartamento"
                                        fullWidth
                                        error={!!errors.residentes?.[0]?.apto}
                                        helperText={errors.residentes?.[0]?.apto?.message}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                        <Titulo titulo="Residentes" />
                            {residentesFields.map((item, index) => (
                                <FormResidente key={item.id} index={index} />
                            ))}
                        </Grid>

                        <Grid item xs={12}>
                        <Titulo titulo="Veículos" />
                            {veiculosFields.map((item, index) => (
                                <FormVeiculo key={item.id} index={index} />
                            ))}
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Button type="submit" variant="contained">
                                Enviar
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ ml: 2 }}
                                onClick={() => reset()}
                            >
                                Limpar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </Container>
    );
};
