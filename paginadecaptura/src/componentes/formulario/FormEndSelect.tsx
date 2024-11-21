import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

interface CondominioSelectProps {
  error?: string;
  loading: boolean;
  condominios: { codigoCondominio: string; nomeCondominio: string }[];
  control: any;
}

export const CondominioSelect: React.FC<CondominioSelectProps> = ({
  error,
  loading,
  condominios,
  control,
}) => (
  <FormControl fullWidth error={!!error}>
    <InputLabel id="condominio-label">Condomínio</InputLabel>
    <Controller
      name="condominio"
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
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);