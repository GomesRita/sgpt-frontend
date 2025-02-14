import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" }, // Use "senha" ao invés de "password"
      },
      async authorize(credentials) {
        // Faça uma chamada ao seu backend Spring Boot para autenticar o usuário
        const res = await fetch("http://localhost:8080/login", {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            senha: credentials?.senha, // Envie "senha" ao invés de "password"
          }),
          headers: { "Content-Type": "application/json" },
        });

        const user = await res.json();

        if (res.ok && user) {
          // Retorne o objeto do usuário, que será armazenado na sessão
          return user;
        }

        // Se a autenticação falhar, retorne null
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT para gerenciar a sessão
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adicione o token JWT retornado pelo backend ao token do NextAuth
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicione o token JWT à sessão do usuário
      session.accessToken = token.accessToken;
      console.log("session: ", session);
      
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Página personalizada de login
  },
});

export { handler as GET, handler as POST };