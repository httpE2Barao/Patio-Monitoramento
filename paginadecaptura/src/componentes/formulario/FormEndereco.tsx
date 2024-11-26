import {
  FormHelperText,
  Grid,
  TextField
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Schema } from "../schema-zod";
import { CondominioSelect } from "./FormEndSelect";
import { Titulo } from "./titulo";

export const FormEndereco: React.FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<Schema>();
  const [condominios, setCondominios] = useState<
    { codigoCondominio: string; nomeCondominio: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const response = await fetch("/api/condominios");
        if (!response.ok) {
          throw new Error(
            `Erro ao obter condomínios: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setCondominios(data.condominios);
      } catch (error) {
        console.error("Erro ao obter condomínios:", error);
        setError("Erro ao obter condomínios.");
      } finally {
        setLoading(false);
      }
    };

    fetchCondominios();
  }, []);

  return (
    <Grid item xs={12}>
      <Titulo titulo="Endereço" />
      <Grid container key={0} spacing={2}>
        <Grid item xs={12} md={6}>
          <CondominioSelect 
            control={control} 
            error={''}
            loading={loading} 
            condominios={condominios} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register(`endereco.apto` as const)}
            label="Apartamento e Bloco"
            placeholder="Exemplo: 55 B1"
            fullWidth
            error={!!errors.endereco?.apto}
            helperText={errors.endereco?.apto?.message}
          />
          {!errors.endereco?.apto && (
            <FormHelperText>Digite o bloco em seguida do apartamento se existir.</FormHelperText>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
