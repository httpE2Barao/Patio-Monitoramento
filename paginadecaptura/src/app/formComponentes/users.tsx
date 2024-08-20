import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTitular } from "./FormTitular";
import { FormResident } from "./FormResidencial";
import { Button, Box } from "@mui/material";
import { schema, Schema } from "./schema";

export const Users = () => {
    const methods = useForm<Schema>({
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

    const onSubmit = (data: Schema) => {
        console.log(data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col items-center justify-evenly">

                <FormTitular />

                <hr />

                {fields.map((field, index) => (
                    <FormResident key={field.id} index={index} />
                ))}

                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                    <Button variant="contained" onClick={() => append({ nome: "", telefone: "", email: "", tipoDocumento: "RG", documento: "", parentesco: "" })}>
                        Adicionar Residente
                    </Button>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                    <Button type="submit" variant="contained">
                        Enviar
                    </Button>
                </Box>

            </form>
        </FormProvider>
    );
};
