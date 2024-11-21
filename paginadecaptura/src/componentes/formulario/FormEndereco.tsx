import {
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Schema } from "../../pages/api/schema-zod";
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
          <FormControl fullWidth error={!!errors.endereco?.condominio}>
            <InputLabel id="condominio-label">Condomínio</InputLabel>
            <Controller
              name="endereco.condominio"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="condominio-label"
                  label="Condomínio"
                  disabled={loading || condominios.length === 0}
                >
                  {condominios.map((condominio) => (
                    <MenuItem
                      key={condominio.codigoCondominio}
                      value={condominio.codigoCondominio}
                    >
                      {condominio.nomeCondominio}
                    </MenuItem>
                  ))}
                  {!loading && condominios.length === 0 && (
                    <MenuItem disabled>Nenhum condomínio disponível</MenuItem>
                  )}
                </Select>
              )}
            />
            {errors.endereco?.condominio?.message && (
              <FormHelperText>
                {errors.endereco?.condominio?.message}
              </FormHelperText>
            )}
            {error && (
              <FormHelperText error>{error}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register(`endereco.apto` as const)}
            label="Apartamento e Bloco"
            fullWidth
            error={!!errors.endereco?.apto}
            helperText={errors.endereco?.apto?.message}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
