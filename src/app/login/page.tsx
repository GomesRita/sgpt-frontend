"use client";

import { Form, Input, Button, message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = async (values: { email: string; senha: string }) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      senha: values.senha
    });

    console.log("result: ",result);
    

    if (result?.ok) {
      message.success("Login realizado com sucesso!");
      console.log("sucessooooo");
      
      router.push("/projetos");
    } else {
      message.error("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 50 }}>
      <h2>Login</h2>
      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item label="E-mail" name="email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Senha" name="senha" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Entrar
        </Button>
      </Form>
    </div>
  );
}