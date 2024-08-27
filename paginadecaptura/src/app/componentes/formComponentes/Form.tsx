import React, { useEffect, useState } from "react";
import { Grid, Button, Container, Autocomplete, TextField } from "@mui/material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, Schema } from "./schema";
import { FormVeiculo } from "./FormVeiculo";
import { FormEndereco } from "./FormEndereco";
import { FormResidentes } from "./FormResidentes";
import Cliente from "./construtor";

export const Form = () => {
    const methods = useForm<Schema>({
        mode: "all",
        resolver: zodResolver(schema),
        defaultValues: {
            residentes: [{ nome: '', telefone: '', email: '', tipoDocumento: 'RG', documento: '' }],
            veiculos: [{ cor: '', modelo: '', placa: '' }],
            endereco: [{ condominio: '', apto: '' }]
        }
    });

    const { handleSubmit, reset } = methods;

    const { fields: residentesFields, append: appendResidente, remove: removeResidente } = useFieldArray({
        name: "residentes",
        control: methods.control
    });
    const { fields: veiculosFields, append: appendVeiculo, remove: removeVeiculo } = useFieldArray({
        name: "veiculos",
        control: methods.control
    });

    const [parentescos, setParentescos] = useState<{ id: number, value: string }[]>([]);

    useEffect(() => {
        fetch("/parentescos.json")
            .then(res => res.json())
            .then(data => setParentescos(data))
            .catch(err => console.error("Erro ao carregar os parentescos:", err));
    }, []);

    const onSubmit = async (data: Schema) => {
        // const cliente = new Cliente(data.titular, data.veiculos);
        // cliente.salvarDados(); // Implemente a lógica para salvar os dados
        console.log("Dados do cliente:", data);
    };

    return (
        <Container>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col items-center justify-evenly">
                    <Grid container spacing={3} sx={{ pb: 4, pr: 1, width: "95%", m: "auto" }}>
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

                        <Grid item xs={12} sx={{ mt: 3, justifyContent: "space-around", display: "flex" }}>
                            <Button
                                variant="outlined"
                                onClick={() => reset()}
                                sx={{ ml: 2, fontSize: "large" }}>
                                Resetar
                            </Button>
                            <Button type="submit" variant="contained" sx={{ fontSize: "large" }}>
                                Enviar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </Container>
    );
};
