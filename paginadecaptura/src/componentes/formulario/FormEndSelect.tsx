import { Autocomplete, FormControl, TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

interface Condominio {
  codigoCondominio: string;
  nomeCondominio: string;
}

interface CondominioSelectProps {
  error?: string;
  loading: boolean;
  condominios: Condominio[];
  control: any; // Substitua 'any' pelo tipo adequado do seu formulário
}

export const CondominioSelect: React.FC<CondominioSelectProps> = ({
  error,
  loading,
  condominios = [],
  control,
}) => (
  <FormControl fullWidth error={!!error}>
    <Controller
      name="endereco.condominio" // Ajuste o nome conforme a estrutura do seu formulário
      control={control}
      rules={{ required: "Condomínio é obrigatório" }} // Adicione validação se necessário
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={condominios}
          getOptionLabel={(option) => option.nomeCondominio || ""}
          isOptionEqualToValue={(option, value) =>
            option.codigoCondominio === value?.codigoCondominio
          }
          loading={loading}
          value={field.value || null} // Garantir que nunca seja undefined
          onChange={(event, newValue) => {
            field.onChange(newValue || null); // Atualizar o campo com o objeto selecionado ou null
          }}
          // Filtra os resultados apenas se houver algo digitado
          filterOptions={(options, state) => {
            const inputValue = state.inputValue.trim().toLowerCase();
            if (inputValue.length < 4) {
              return []; // Mostrar nenhuma opção se menos de 4 caracteres forem digitados
            }
            return options.filter((option) =>
              option.nomeCondominio.toLowerCase().includes(inputValue)
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Condomínio"
              variant="outlined"
              placeholder="Nome do condomínio" // Definir o valor padrão de placeholder
              error={!!error}
              helperText={error}
            />
          )}
          noOptionsText="Digite pelo menos 4 caracteres para ver os resultados"
        />
      )}
    />
  </FormControl>
);
