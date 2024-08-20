import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTitular } from "./FormTitular";
import { FormResident } from "./FormResidencial";
import { Button, Box } from "@mui/material";
import { schema } from "./schema";
import {FormSchemaType} from "./schema";

export const Users = () => {
    const methods = useForm<FormSchemaType>({
        mode: "all",
        resolver: zodResolver(schema),
        defaultValues: {
            tipoDocumento: "RG",
            residentes: []
        }
    });

    const { control, handleSubmit } = methods;
    const { fields, append } = useFieldArray({
        control,
        name: "residentes"
    });

    const onSubmit = (data: FormSchemaType) => {
        console.log(data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitular />

                {fields.map((field, index) => (
                    <FormResident key={field.id} index={index} />
                ))}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button variant="contained" onClick={() => append({ nome: "", telefone: "", email: "", tipoDocumento: "RG", documento: "", parentesco: "" })}>
                        Adicionar Residente
                    </Button>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button type="submit" variant="contained">
                        Enviar
                    </Button>
                </Box>
            </form>
        </FormProvider>
    );
};
