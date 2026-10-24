import type {
  Doctor,
  PatientSummary,
  ProposalDetail,
  QueueEntryDetail,
} from "@/lib/api/types";

// Dados de demonstração. Nomes e números são fictícios; o CNS só existe mascarado.

export const demoDoctor: Doctor = {
  id: "med-1",
  name: "Dra. Helena Duarte",
  crm: "CRM/RJ 52871",
};

/** Credenciais do médico de demonstração no modo mock. */
export const demoCredentials = {
  identifier: "CRM/RJ 52871",
  password: "demo1234",
};

const marina: PatientSummary = {
  id: "pac-4821",
  name: "Marina Albuquerque",
  cnsMasked: "***.****.****.4821",
  procedure: "Artroplastia total de joelho",
  priority: "Moderada",
  waitingSince: "2026-03-10",
};

const paulo: PatientSummary = {
  id: "pac-1175",
  name: "Paulo Henrique Souza",
  cnsMasked: "***.****.****.1175",
  procedure: "Colecistectomia",
  priority: "Baixa",
  waitingSince: "2025-11-04",
};

const rita: PatientSummary = {
  id: "pac-9034",
  name: "Rita de Cássia Lima",
  cnsMasked: "***.****.****.9034",
  procedure: "Hérnia inguinal",
  priority: "Moderada",
  waitingSince: "2026-01-22",
};

const otherPatients: PatientSummary[] = [
  {
    id: "pac-2271",
    name: "João Batista Ferreira",
    cnsMasked: "***.****.****.2271",
    procedure: "Colecistectomia",
    priority: "Alta",
    waitingSince: "2025-08-15",
  },
  {
    id: "pac-8804",
    name: "Lúcia Marques",
    cnsMasked: "***.****.****.8804",
    procedure: "Catarata",
    priority: "Alta",
    waitingSince: "2025-09-02",
  },
  {
    id: "pac-3318",
    name: "Antônio Carlos Ribeiro",
    cnsMasked: "***.****.****.3318",
    procedure: "Hérnia inguinal",
    priority: "Moderada",
    waitingSince: "2025-10-20",
  },
];

export const proposals: ProposalDetail[] = [
  {
    id: "prop-1",
    status: "pending",
    patient: marina,
    currentPosition: 42,
    proposedPosition: 31,
    reasonSummary:
      "Piora relatada da dor (5 para 8 em 10) e da mobilidade, com 7 meses de espera acumulados.",
    createdAt: "2026-10-20T09:12:00-03:00",
    criteria: [
      { key: "dor", label: "Dor", value: "8/10", previousValue: "5/10" },
      {
        key: "limitacao_funcional",
        label: "Limitação funcional",
        value: "Anda com apoio",
        previousValue: "Anda sem apoio",
      },
      {
        key: "tempo_espera",
        label: "Tempo de espera",
        value: "7 meses",
        previousValue: null,
      },
    ],
    documents: [
      {
        id: "doc-1",
        kind: "patient_statement",
        title: "Relato de dor 8/10 enviado pelo paciente",
        receivedAt: "2026-09-08T10:00:00-03:00",
      },
      {
        id: "doc-2",
        kind: "exam",
        title: "Eletrocardiograma pré-operatório",
        receivedAt: "2026-10-23T15:30:00-03:00",
      },
      {
        id: "doc-3",
        kind: "exam",
        title: "Raio-X do joelho",
        receivedAt: "2026-10-20T11:00:00-03:00",
        summary: "Em análise",
      },
    ],
    tribunal: [
      {
        agent: "evidencias",
        label: "Agente de evidências",
        opinion:
          "Dor e mobilidade pioraram e há exame anexado que sustenta a piora. Recomenda subir a posição.",
      },
      {
        agent: "contestacao",
        label: "Agente de contestação",
        opinion:
          "O laudo da ressonância tem mais de 60 dias e o relato não substitui exame. Pede confirmação antes de aprovar.",
      },
      {
        agent: "equidade",
        label: "Agente de equidade e regras",
        opinion:
          "A mudança respeita o limite por reavaliação e não passa à frente de quem tem prioridade maior e mais espera.",
      },
    ],
    equityChecks: [
      {
        rule: "max_elevation",
        label: "Limite de elevação por reavaliação",
        passed: true,
        detail: "Elevação de 11 posições, dentro do limite.",
      },
      {
        rule: "no_overtake_higher_priority",
        label: "Não passar à frente de prioridade maior",
        passed: true,
        detail: "Ninguém com prioridade Alta fica atrás.",
      },
    ],
    history: [],
  },
  {
    id: "prop-2",
    status: "pending",
    patient: paulo,
    currentPosition: 118,
    proposedPosition: 104,
    reasonSummary: "Novo exame mostra piora das crises de dor abdominal.",
    createdAt: "2026-10-21T14:40:00-03:00",
    criteria: [
      { key: "dor", label: "Dor", value: "7/10", previousValue: "4/10" },
    ],
    documents: [
      {
        id: "doc-4",
        kind: "exam",
        title: "Ultrassom de abdome",
        receivedAt: "2026-10-18T08:20:00-03:00",
      },
    ],
    tribunal: [],
    equityChecks: [],
    history: [],
  },
  {
    id: "prop-3",
    status: "pending",
    patient: rita,
    currentPosition: 77,
    proposedPosition: 70,
    reasonSummary: "Comorbidade nova informada pela unidade de saúde.",
    createdAt: "2026-10-22T16:05:00-03:00",
    criteria: [
      {
        key: "comorbidades",
        label: "Comorbidades",
        value: "Diabetes",
        previousValue: "Nenhuma",
      },
    ],
    documents: [],
    tribunal: [],
    equityChecks: [],
    history: [],
  },
];

export const queue: QueueEntryDetail[] = [
  ...otherPatients,
  marina,
  rita,
  paulo,
].map((patient, index) => ({
  position: index + 1,
  patient,
  lastPositionChangeAt: null,
  status: proposals.some((p) => p.patient.id === patient.id)
    ? "pending_proposal"
    : "none",
  criteria: [],
  justification: `Posição definida pela prioridade ${patient.priority} e pelo tempo de espera.`,
  history: [],
}));
