"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Container, Grid } from "@mui/material";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { schema, Schema } from "../../app/schema-zod";
import Cliente from "../classeCliente";
import { FormEndereco } from "./FormEndereco";
import { FormFeedback } from "./FormFeedback";
import { FormResidentes } from "./FormResidentes";
import { FormRetorno } from "./FormRetorno";
import { FormVeiculo } from "./FormVeiculo";

export const Form = () => {
    const methods = useForm<Schema>({
        mode: "all",
        resolver: zodResolver(schema),
        defaultValues: {
            endereco: { condominio: '', apto: '' },
            residentes: [{ nome: '', telefone: '', email: '', tipoDocumento: 'RG', documento: '' }],
            veiculos: [{ cor: '', modelo: '', placa: '' }],
            feedback: '',
        }
    });

    const { fields: residentesFields } = useFieldArray({
        name: "residentes",
        control: methods.control
    });

    const { fields: veiculosFields } = useFieldArray({
        name: "veiculos",
        control: methods.control
    });

    const [retornoForm, setRetornoForm] = useState<boolean|undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    const { handleSubmit, reset } = methods;

    const onSubmit = async (data: Schema) => {
        setLoading(true);
        const novoCliente = new Cliente(data);
        console.log(novoCliente);
        try {
            await novoCliente.enviarCliente();
            setRetornoForm(true);
        } catch (error) {
            console.error(error);
            setRetornoForm(false);
        } finally {
            setLoading(false);
            reset();
        }
    };

    return (
        <Container>
            <FormProvider {...methods}>
                <form className="flex gap-2 flex-col items-center justify-evenly">
                    <Grid container spacing={1} sx={{ pb: 4, maxWidth: "100%", m: "auto" }}>
                        <Grid item xs={12}>
                            <FormEndereco />
                        </Grid>
                        <Grid item xs={12}>
                            {residentesFields.map((item, index) => (
                                <FormResidentes key={item.id} index={index} />
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            {veiculosFields.map((item, index) => (
                                <FormVeiculo key={item.id} index={index} />
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <FormFeedback />
                        </Grid>
                        <Grid item xs={12}>
                            <span className="flex justify-center items-center mt-2">
                                {loading ? <CircularProgress /> : <FormRetorno enviado={retornoForm} />}
                            </span>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, justifyContent: "space-around", display: "flex" }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    reset();
                                    setRetornoForm(undefined);
                                }}
                                sx={{ ml: 2, fontSize: "large" }}>
                                Resetar
                            </Button>
                            <Button onClick={handleSubmit(onSubmit)} variant="contained" sx={{ fontSize: "large" }}>
                                Enviar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </Container>
    );
};
