"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCreateTarefa, useDeleteTarefa, useTarefas, useUpdateTarefas } from "../actions/fetchTarefas";
import { BadgePlusIcon, CircleXIcon } from "lucide-react";
import { useState } from "react";

export default function TarefasSection() {
  const queryClient = useQueryClient();
  const [conteudo, setConteudo] = useState("");
  const { isLoading, data, isFetching } = useTarefas();
  const { mutateAsync: update, isPending } = useUpdateTarefas();
  const { mutateAsync: create, isPending: isLoadingCriacao } = useCreateTarefa();
  const { mutateAsync: deletaNoticia, isPending: isLoadingDelete } = useDeleteTarefa();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!conteudo.trim()) return;

    await create(
      { conteudo },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tarefas"] });
          setConteudo("");
        },
        onError: () => {
          console.log("Erro ao criar tarefa");
        },
      }
    );
  }

  function onUpdate(id, novoConteudo) {
    update(
      { id, conteudo: novoConteudo },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
      }
    );
  }

  function onToggleConcluida(id, concluida) {
    update(
      { id, concluida: !concluida },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
      }
    );
  }

  return (
    <div>
      {isLoadingCriacao && <span>Criando tarefa ...</span>}
      <div className="flex justify-center">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input
            name="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Conteúdo da tarefa"
            className="border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 p-3 rounded-lg w-full text-black placeholder-gray-500 focus:outline-none transition-all"
          />
          <button type="submit" className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition">
            <BadgePlusIcon size={24} color="white" />
          </button>
        </form>
      </div>
      <br/>
      {isLoadingDelete && <span>Deletando tarefa ...</span>}
      {!isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((t) => (
            <div
              key={t.id}
              className={`shadow-lg rounded-lg p-4 border ${
                t.concluida ? "bg-green-100 border-green-500" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3
                  className={`text-lg font-semibold ${
                    t.concluida ? "text-green-700 line-through" : "text-gray-900"
                  }`}
                >
                  {t.conteudo}
                </h3>
                <button
                  className="text-red-500"
                  onClick={() =>
                    deletaNoticia(
                      { id: t.id },
                      {
                        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
                      }
                    )
                  }
                >
                  <CircleXIcon/>
                </button>
              </div>
              <input
                type="text"
                defaultValue={t.conteudo}
                className="mt-2 w-full border px-2 py-1 rounded"
                onBlur={(e) => onUpdate(t.id, e.target.value)}
              />
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={t.concluida}
                  onChange={() => onToggleConcluida(t.id, t.concluida)}
                  className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-400"
                />
                <label className="ml-2 text-sm text-gray-700">Concluída</label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Por: {t.usuario.nome}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Carregando tarefas ....</p>
      )}
    </div>
  );
}