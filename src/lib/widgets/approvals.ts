// Dados do widget "Aprovações" no painel do Windows 11 (spec 010).

type SignedInApprovals = {
  signedIn: true;
  count: string;
  label: string;
  buttonText: string;
  url: string;
  altText: string;
};

type SignedOutApprovals = {
  signedIn: false;
  message: string;
  buttonText: string;
  url: string;
  altText: string;
};

export type ApprovalsWidgetData = SignedInApprovals | SignedOutApprovals;

type Input = { signedIn: true; pendingTotal: number } | { signedIn: false };

export function approvalsWidgetData(input: {
  signedIn: true;
  pendingTotal: number;
}): SignedInApprovals;
export function approvalsWidgetData(input: {
  signedIn: false;
}): SignedOutApprovals;
export function approvalsWidgetData(input: Input): ApprovalsWidgetData;
export function approvalsWidgetData(input: Input): ApprovalsWidgetData {
  if (!input.signedIn) {
    const message = "Entre no SUSight Clínica para ver suas revisões";
    return {
      signedIn: false,
      message,
      buttonText: "Entrar",
      url: "/login",
      altText: `${message}.`,
    };
  }
  const total = input.pendingTotal;
  const label =
    total === 0
      ? "nenhuma proposta para revisar"
      : total === 1
        ? "proposta para revisar"
        : "propostas para revisar";
  return {
    signedIn: true,
    count: String(total),
    label,
    buttonText: "Revisar",
    url: "/revisoes",
    altText: `${total === 0 ? "Nenhuma proposta para revisar" : `${total} ${label}`}. Abre as revisões pendentes.`,
  };
}
