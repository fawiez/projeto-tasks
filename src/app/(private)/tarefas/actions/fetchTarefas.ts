import { useMutation, useQuery } from "@tanstack/react-query";

async function getTarefas() {
  const res = await fetch("/api/tarefas");
  if (!res.ok) {
    throw new Error("Erro na busca de tarefas");
  }
  return res.json();
}

async function createTarefa(data: any) {
  const res = await fetch("/api/tarefas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar tarefa");
  }
  return res.json();
}

async function updateTarefa(data: any) {
  const res = await fetch("/api/tarefas", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro na busca de tarefas");
  }
  return res.json();
}

export function useTarefas() {
  return useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateTarefas() {
  return useMutation({
    mutationFn: (data) => updateTarefa(data),
  });
}

export function useCreateTarefa() {
  return useMutation({
    mutationFn: (data) => createTarefa(data),
  });
}

export function useDeleteTarefa() {
  return useMutation({
    mutationFn: (data: any) => deleteTarefa(data.id),
  });
}

async function deleteTarefa(id: number) {
  const res = await fetch(`/api/tarefas/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Erro ao deletear tarefa");
  }
  return res.json();
}
