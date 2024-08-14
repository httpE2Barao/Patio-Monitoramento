import { Autocomplete, RadioGroup, FormControlLabel, Radio, Stack, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { schema, Schema } from "./schema";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export function Users() {
    const { control, register, formState: { errors }, watch } = useForm<Schema>({
        mode: "all",
        resolver: zodResolver(schema),
        defaultValues: {
            tipoDocumento: "RG"
        }
    });

    useEffect(() => {
        const sub = watch((value) => {
            console.log(value);
        });
        return () => sub.unsubscribe();
    }, [watch]);

    return (
        <Stack sx={{ gap: "1rem", mx: "3rem" }}>
            <RadioGroup sx={{ gap: "1rem", display: "flex", flexDirection: "row" }}>
                <FormControlLabel value="Cadastrado" control={<Radio />} label="Já possuo cadastro" />
                <FormControlLabel value="Novo cadastro" control={<Radio />} label="Sou novo morador" />
            </RadioGroup>
            <TextField {...register("nome")} label="Nome" error={!!errors.nome} helperText={errors.nome?.message} />
            <TextField {...register("email")} label="Email" error={!!errors.email} helperText={errors.email?.message} />
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
                renderInput={(params) => <TextField {...params} label="Nível de parentesco" />}
            />
            <Controller
                name="tipoDocumento"
                control={control}
                render={({ field }) => (
                    <RadioGroup {...field} sx={{ gap: "1rem", display: "flex", flexDirection: "row" }}>
                        <FormControlLabel value="RG" control={<Radio />} label="RG" />
                        <FormControlLabel value="CPF" control={<Radio />} label="CPF" />
                        <FormControlLabel value="CNH" control={<Radio />} label="CNH" />
                    </RadioGroup>
                )}
            />
            <TextField {...register("documento")} label="Número do Documento" error={!!errors.documento} helperText={errors.documento?.message} />
        </Stack>
    );
}
