"use client";

import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchProjetos = async () => {
      const response = await fetch(`http://localhost:8080/projetos`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` }
      });

      if (response.ok) {
        setProjetos(await response.json());
      }
    };

    fetchProjetos();
  }, [session, router]);

  return (
    <div>
      <h2>Lista de Projetos</h2>
      <Button type="primary" onClick={() => router.push("/projetos/novo")}>Novo Projeto</Button>
      <Table
        dataSource={projetos}
        columns={[
          { title: "Nome", dataIndex: "nome", key: "nome" },
          {
            title: "Ações",
            render: (_, projeto) => (
              <>
                <Button onClick={() => router.push(`/projetos/${projeto.id}`)}>Editar</Button>
                <Button danger onClick={async () => {
                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projetos/${projeto.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${session?.accessToken}` }
                  });
                  message.success("Projeto excluído!");
                  setProjetos(projetos.filter(p => p.id !== projeto.id));
                }}>
                  Excluir
                </Button>
              </>
            )
          }
        ]}
      />
    </div>
  );
}