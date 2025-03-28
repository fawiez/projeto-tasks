import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }) {
    const id = params.id;
    
    if (!id) {
        return NextResponse.json({ message: "ID é obrigatório" }, { status: 400 });
    }
    
    try {
        await prisma.tarefa.delete({
            where: { id: id },
        });
        return NextResponse.json({ message: "Tarefa deletada com sucesso" });
    } catch (error) {
        return NextResponse.json({ message: "Erro ao deletar a tarefa" }, { status: 500 });
    }
}