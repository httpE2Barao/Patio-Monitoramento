import { Autocomplete, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { schema, Schema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export function Users() {
    const { register, formState: { errors }, watch } = useForm<Schema>({
        mode: "all",
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        const sub = watch((value) => {
            console.log(value);
        });
        return () => sub.unsubscribe();
    }, [watch]);

    return (
        <Stack sx={{ gap: "1rem", mx: "3rem" }}>
            <TextField {...register("nome")} label="Nome" error={!!errors.nome} helperText={errors.nome?.message} />
            <TextField {...register("email")} label="Email" error={!!errors.email} helperText={errors.email?.message} />
            <Autocomplete
                options={[
                    { id: "1", value: "Filho(a)" },
                    { id: "2", value: "Pai" },
                    { id: "3", value: "Mãe" },
                ]}
                getOptionLabel={(option) => option.value}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} label="Nível de parentesco" />}
            />
        </Stack>
    )
}
