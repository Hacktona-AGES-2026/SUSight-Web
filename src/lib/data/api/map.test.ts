import { expect, test } from "vitest";
import {
  detailFrom,
  entryFrom,
  patientFromRow,
  statusFromBackend,
} from "./map";

const row = {
  solicitacao_id: "SOL-1004",
  paciente_id: "PAC-1004",
  cid: "M170",
  dias_em_fila: 228,
  posicao: 4,
  prioridade_regulacao: "Média",
  criterios: { dor: 6, distancia: 25 },
};

test("traduz a fila do backend sem inventar CNS", () => {
  const patient = patientFromRow(row, new Date("2026-10-24"));

  expect(patient.id).toBe("SOL-1004");
  expect(patient.procedure).toBe("Artroplastia de joelho");
  expect(patient.priority).toBe("Moderada");
  expect(patient.waitingSince).toBe("2026-03-10");
  expect(patient.cnsMasked).toBe("Solicitação SOL-1004");
  expect(entryFrom({ ...row, em_reavaliacao: true }, false).status).toBe(
    "under_review",
  );
  expect(entryFrom(row, true).status).toBe("pending_proposal");
});

test("traduz o detalhe da proposta com parecer, travas e histórico", () => {
  const detail = detailFrom(
    {
      proposta_id: "p1",
      solicitacao_id: "SOL-1004",
      situacao: "pronta_para_medico",
      posicao_atual: 4,
      posicao_proposta: 2,
      recomendacao: "aprovar",
      ordenacao_incerta: true,
      evidencias_conflitantes: false,
      criada_em: "2026-10-24T17:49:34+00:00",
      criterios: { dor: 6 },
      evidencias: [
        {
          evidencia_id: "E1",
          tipo: "exame_imagem",
          resultado: "piora",
          data: "2026-10-20",
          trecho: "Raio-X",
        },
      ],
      parecer: {
        recomendacao: "aprovar",
        posicao: 3,
        travas: ["limite_elevacao_10_porcento"],
        manifestacoes: [
          {
            agente: "contestacao",
            veredito: "contra",
            justificativa: "Sem comprovação",
          },
        ],
      },
      historico: [
        {
          tipo: "entrada_na_fila",
          texto: "Entrou na fila.",
          responsavel: "seed",
          motivo: null,
          data_hora: "2026-10-24T17:00:00+00:00",
        },
      ],
      decisao: null,
    },
    row,
  );

  expect(detail.status).toBe("pending");
  expect(detail.proposedPosition).toBe(3);
  expect(detail.criteria[0]).toMatchObject({ key: "dor", value: "6/10" });
  expect(detail.documents[0].kind).toBe("exam");
  expect(detail.tribunal[0].verdict).toBe("contra");
  expect(detail.equityChecks[0]).toMatchObject({
    rule: "max_elevation",
    passed: false,
  });
  expect(detail.history[0].type).toBe("queue_entry");
  expect(detail.decidedBy).toBeUndefined();
});

test("situações do backend viram as do web", () => {
  expect(statusFromBackend("pedir_informacoes")).toBe("awaiting_patient");
  expect(statusFromBackend("aprovar")).toBe("approved");
  expect(statusFromBackend("rejeitar")).toBe("rejected");
});
