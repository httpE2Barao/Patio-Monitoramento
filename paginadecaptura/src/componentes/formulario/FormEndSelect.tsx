import { Autocomplete, FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

interface Condominio {
  codigoCondominio: string;
  nomeCondominio: string;
}

interface CondominioSelectProps {
  name?: string;
  control?: any;              
  disabled?: boolean;        
  label?: string;
}

export const CondominioSelect: React.FC<CondominioSelectProps> = ({
  control,
  name = "endereco.condominio.codigoCondominio",
  disabled = false,
  label = "Condomínio",
}) => {
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Se estivermos sem control, guardamos o valor selecionado no próprio estado
  const [valueLocal, setValueLocal] = useState<Condominio | null>(null);

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
        setCondominios(data.condominios || []);
      } catch (err) {
        console.error("Erro ao obter condomínios:", err);
        setError("Erro ao obter condomínios.");
      } finally {
        setLoading(false);
      }
    };

    fetchCondominios();
  }, []);

  /**
   * Função que retorna o JSX do <Autocomplete />
   * Recebe por parâmetro:
   * - `value`: o valor controlado (que pode vir do RHF ou do estado local)
   * - `onChange`: a função de onChange a ser chamada quando o usuário seleciona algo
   */
  const renderAutocomplete = (
    value: Condominio | null,
    onChange: (newValue: Condominio | null) => void
  ) => (
    <Autocomplete
      options={condominios}
      getOptionLabel={(option) => option.nomeCondominio || ""}
      isOptionEqualToValue={(option, val) =>
        option.codigoCondominio === val?.codigoCondominio
      }
      loading={loading}
      value={value}
      onChange={(_, newValue) => onChange(newValue || null)}
      filterOptions={(options, state) => {
        const inputValue = state.inputValue.trim().toLowerCase();
        if (inputValue.length < 4) {
          return [];
        }
        return options.filter((option) =>
          option.nomeCondominio.toLowerCase().includes(inputValue)
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          placeholder="Nome do condomínio"
          error={!!error}
          helperText={error}
        />
      )}
      noOptionsText={`Digite pelo menos 4 caracteres para ver os resultados`}
      disabled={disabled}
    />
  );

  return (
    <FormControl fullWidth error={!!error}>
      {control ? (
        // Se temos control, usamos o Controller do react-hook-form
        <Controller
          name={name}
          control={control}
          rules={{ required: "Condomínio é obrigatório" }}
          render={({ field }) =>
            renderAutocomplete(field.value || null, field.onChange)
          }
        />
      ) : (
        // Caso contrário, renderizamos com estado local
        renderAutocomplete(valueLocal, (newValue) => setValueLocal(newValue))
      )}
    </FormControl>
  );
};