"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCreateTarefa, useDeleteTarefa, useTarefas, useUpdateTarefas } from "../actions/fetchTarefas";
import { BadgePlusIcon } from "lucide-react";

export default function TarefasSection() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading, data, isFetching } = useTarefas();
  const { mutateAsync: update, isPending } = useUpdateTarefas();
  const { mutateAsync: create, isPending: isLoadingCriacao } = useCreateTarefa();
  const { mutateAsync: deletaNoticia, isPending: isLoadingDelete } = useDeleteTarefa();

  function onSubmit(data: any) {
    console.log(data);
    create(data, {
      onSuccess: () => {
        console.log("Sucesso");
        queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      },
      onError: () => {
        console.log("Erro");
      },
    });
  }

  return (
    <>
      {isLoadingCriacao && <span>Criando tarefa ...</span>}
      <div className="flex justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({
              conteudo: formData.get("conteudo"),
            });
          }}
        >
        <input name="conteudo" placeholder="Conteúdo da notícia" 
        className="border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 p-3 rounded-lg w-full text-black placeholder-gray-500 focus:outline-none transition-all"/>
        <button type="submit"> <BadgePlusIcon size={24} color='#008000'/></button>
        </form>
        {isLoadingDelete && <span>Deletando tarefa ...</span>}
      </div>
      {!isFetching ? (
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {data?.map((task: any) => (
            <article
              key={task.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-500">2025-03-15</time>
              </div>
              <div className="group relative">
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                  {task.conteudo}
                </p>
              </div>

              <button
                className="text-red-500"
                onClick={() => {
                  deletaNoticia(
                    {
                      id: task.id,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ["tarefas"],
                        });
                      },
                    }
                  );
                }}
              >
                Deletar
              </button>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="text-sm/6">
                  <p className="font-semibold text-gray-900">
                    <span>
                      <span className="absolute inset-0" />
                      {task.usuario.nome}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>Carregando tarefas ....</>
      )}
    </>
  );
}
