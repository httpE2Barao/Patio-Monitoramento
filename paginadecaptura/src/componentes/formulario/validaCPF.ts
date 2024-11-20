export function validarCPF(cpf: string): boolean {
    // Remove caracteres que não sejam números
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se o CPF tem 11 dígitos ou se todos os números são iguais (CPFs inválidos)
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Função para calcular os dígitos verificadores
    const calcularDigito = (cpf: string, multiplicadorInicial: number): number => {
        let soma = 0;
        for (let i = 0; i < multiplicadorInicial - 1; i++) {
            soma += parseInt(cpf[i]) * (multiplicadorInicial - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 || resto === 11 ? 0 : resto;
    };

    // Calcula o primeiro dígito verificador
    const digito1 = calcularDigito(cpf, 10);
    // Calcula o segundo dígito verificador
    const digito2 = calcularDigito(cpf, 11);

    // Verifica se os dígitos calculados batem com os dígitos informados no CPF
    return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
}

// Exemplo de uso:
const cpfValido = validarCPF("123.456.789-09"); // Insira um CPF de teste
console.log(cpfValido ? "CPF válido" : "CPF inválido");
