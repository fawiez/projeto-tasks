import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest, { params }) {
  const postagens = await prisma.tarefa.findMany({
    include: {
      usuario: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  });
  return NextResponse.json(postagens);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log(data);
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Usuário precisa estar autenticado!",
      },
      {
        status: 400,
      }
    );
  }

  const postagem = await prisma.tarefa.create({
    data: {
      conteudo: data.conteudo,
      concluida: false,
      usuario_id: session?.user?.id,
    },
  });

  return NextResponse.json(postagem);
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { message: "Usuário precisa estar autenticado!" },
      { status: 400 }
    );
  }

  try {
    const tarefaAtualizada = await prisma.tarefa.update({
      where: { id: data.id },
      data: {
        conteudo: data.conteudo,
        concluida: data.concluida,
      },
    });
    return NextResponse.json(tarefaAtualizada);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar tarefa" },
      { status: 500 }
    );
  }
}
