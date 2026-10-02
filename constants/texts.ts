export const TEXTS = {
    APP_NAME: "Amortiza+",
    APP_DESCRIPTION: "Calcule seu financiamento imobiliário de forma rápida e transparente.",

    // Home
    HOME_NEW_SIMULATION_TITLE: "Nova simulação",
    HOME_NEW_SIMULATION_DESCRIPTION: "Informe os dados do imóvel e veja parcelas, juros e evolução do saldo.",
    HOME_SAVED_SIMULATIONS_TITLE: "Simulações salvas",
    HOME_SAVED_SIMULATIONS_DESCRIPTION: "Consulte e compare as simulações que você guardou.",
    HOME_SAVED_COUNT: (count: number) => {
        if (count === 0) return "Nenhuma simulação salva ainda";
        return count === 1 ? "1 simulação salva" : `${count} simulações salvas`;
    },
    HOME_DISCLAIMER: "Valores estimados. Seguros (MIP/DFI), taxas administrativas e TR não estão incluídos.",

    // Formulário
    LOAN_FORM_TITLE: "Nova simulação",
    LOAN_FORM_PROPERTY_VALUE: "Valor do imóvel",
    LOAN_FORM_DOWN_PAYMENT: "Valor da entrada",
    LOAN_FORM_INTEREST_RATE: "Taxa de juros efetiva anual",
    LOAN_FORM_LOAN_TERM: "Prazo",
    LOAN_FORM_RATE_SUFFIX: "% a.a.",
    LOAN_FORM_TERM_SUFFIX: "anos",
    LOAN_FORM_CALCULATE: "Calcular financiamento",
    LOAN_FORM_FINANCED: "Valor financiado",
    LOAN_FORM_DOWN_PAYMENT_HINT: (percent: string) => `Entrada de ${percent} do imóvel`,
    LOAN_FORM_LOW_DOWN_PAYMENT: "A maioria dos bancos exige entrada mínima de 20%.",
    LOAN_FORM_RATE_HINT: (monthly: string) => `Equivale a ${monthly} ao mês`,
    LOAN_FORM_TERM_HINT: (months: number) => `${months} parcelas mensais`,

    // Sistemas de amortização
    AMORTIZATION_SYSTEM: "Sistema de amortização",
    AMORTIZATION_PRICE: "Price",
    AMORTIZATION_SAC: "SAC",
    AMORTIZATION_SAC_DESCRIPTION: "Parcelas decrescentes. Começa mais alta, mas paga menos juros no total.",
    AMORTIZATION_PRICE_DESCRIPTION: "Parcelas fixas. Começa mais baixa, mas paga mais juros no total.",

    // Resumo
    LOAN_SUMMARY_TITLE: "Resultado",
    LOAN_SUMMARY_FIRST_PAYMENT: "Primeira parcela",
    LOAN_SUMMARY_FIXED_PAYMENT: "Parcela fixa",
    LOAN_SUMMARY_LAST_PAYMENT: (value: string) => `diminuindo até ${value} na última`,
    LOAN_SUMMARY_DETAILS: "Detalhes",
    LOAN_SUMMARY_PROPERTY_VALUE: "Valor do imóvel",
    LOAN_SUMMARY_DOWN_PAYMENT: "Entrada",
    LOAN_SUMMARY_LOAN_AMOUNT: "Valor financiado",
    LOAN_SUMMARY_INTEREST_RATE: "Taxa de juros",
    LOAN_SUMMARY_RATE_VALUE: (annual: string, monthly: string) => `${annual} a.a. (${monthly} a.m.)`,
    LOAN_SUMMARY_LOAN_TERM: "Prazo",
    LOAN_SUMMARY_TERM_VALUE: (years: number, months: number) => `${years} ${years === 1 ? "ano" : "anos"} (${months} meses)`,
    LOAN_SUMMARY_TOTAL_INTEREST: "Total de juros",
    LOAN_SUMMARY_TOTAL_PAID: "Total pago",
    LOAN_SUMMARY_AMORTIZATION_SYSTEM: "Sistema",
    LOAN_SUMMARY_COMPARISON: "SAC x Price",
    LOAN_SUMMARY_COMPARISON_SAVINGS: (value: string) => `Com SAC você paga ${value} a menos de juros.`,
    LOAN_SUMMARY_COMPARISON_FIRST: "1ª parcela",
    LOAN_SUMMARY_CHART_TITLE: "Saldo devedor ao fim de cada ano",
    LOAN_SUMMARY_SCHEDULE: "Tabela de parcelas",
    LOAN_SUMMARY_SCHEDULE_HINT: "Toque em um ano para ver as parcelas mês a mês.",
    LOAN_SUMMARY_EXPAND_ALL: "Expandir",
    LOAN_SUMMARY_COLLAPSE_ALL: "Recolher",
    LOAN_SUMMARY_SCROLL_TOP: "Voltar ao topo",
    LOAN_SUMMARY_YEAR_A11Y: (year: number) => `Ano ${year}, mostrar parcelas mensais`,
    LOAN_SUMMARY_MONTH_SHORT: (month: number) => `${month}ª`,
    LOAN_SUMMARY_COL_YEAR: "Ano",
    LOAN_SUMMARY_COL_PAID: "Pago",
    LOAN_SUMMARY_COL_INTEREST: "Juros",
    LOAN_SUMMARY_COL_AMORTIZATION: "Amort.",
    LOAN_SUMMARY_COL_BALANCE: "Saldo",
    LOAN_SUMMARY_SAVE: "Salvar simulação",
    LOAN_SUMMARY_SAVED: "Simulação salva",
    LOAN_SUMMARY_SHARE: "Compartilhar",
    LOAN_SUMMARY_INVALID: "Não foi possível carregar esta simulação.",
    LOAN_SUMMARY_SHARE_MESSAGE: (lines: string[]) => ["Amortiza+ — simulação de financiamento", ...lines].join("\n"),

    // Simulações salvas
    SAVED_SIMULATIONS_TITLE: "Simulações salvas",
    SAVED_SIMULATIONS_EMPTY: "Nenhuma simulação salva.",
    SAVED_SIMULATIONS_EMPTY_HINT: "Faça uma simulação e toque no ícone de salvar para guardá-la aqui.",
    SAVED_SIMULATIONS_NEW_SIMULATION: "Nova simulação",
    SAVED_SIMULATIONS_DELETED: "Simulação removida.",
    SAVED_SIMULATIONS_SAVED_ON: (date: string) => `Salva em ${date}`,
    SAVED_SIMULATIONS_DELETE: "Excluir",

    // Diálogos e mensagens
    DIALOG_DELETE_TITLE: "Excluir simulação?",
    DIALOG_DELETE_MESSAGE: "Esta ação não pode ser desfeita.",
    ALERT_SIMULATION_SAVED: "Simulação salva!",
    ALERT_SIMULATION_ALREADY_SAVED: "Esta simulação já estava salva.",
    ALERT_SIMULATION_ERROR: "Erro ao salvar simulação. Tente novamente.",
    ALERT_LOAD_ERROR: "Não foi possível carregar as simulações salvas.",
    ALERT_DELETE_ERROR: "Erro ao excluir simulação.",

    // Erros de validação
    ERROR_PROPERTY_REQUIRED: "Informe o valor do imóvel.",
    ERROR_PROPERTY_TOO_HIGH: "Valor acima do limite de R$ 100 milhões.",
    ERROR_DOWN_PAYMENT_INVALID: "Valor de entrada inválido.",
    ERROR_DOWN_PAYMENT_TOO_HIGH: "A entrada deve ser menor que o valor do imóvel.",
    ERROR_RATE_RANGE: "A taxa deve ser maior que 0% e no máximo 50% ao ano.",
    ERROR_YEARS_RANGE: "O prazo deve ser de 1 a 40 anos.",

    // Botões
    BUTTON_BACK: "Voltar",
    BUTTON_CANCEL: "Cancelar",
    BUTTON_DELETE: "Excluir",
    BUTTON_START: "Começar",
    BUTTON_VIEW: "Ver",
    BUTTON_EDIT: "Editar dados",
};
