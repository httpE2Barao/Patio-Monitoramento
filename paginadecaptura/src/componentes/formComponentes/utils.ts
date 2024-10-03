import { FieldArrayPath, FieldValues, UseFieldArrayAppend } from "react-hook-form";

type ItemType<T> = T extends { residentes: (infer U)[] } ? U :
                   T extends { veiculos: (infer U)[] } ? U :
                   never;

export const adicionarItem = <T extends FieldValues>(
    append: UseFieldArrayAppend<T, FieldArrayPath<T>>,
    valoresPadrao: ItemType<T>
) => {
    append(valoresPadrao as any);
};
