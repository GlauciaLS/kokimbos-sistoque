# Kokimbos Backend

Back-end em produção: https://kokimbos-backend.herokuapp.com/

<h2> Como executar o projeto </h2>

Pré-requisitos: Git, NPM e MySQL.

- Na primeira vez para subir o app, descomente as linhas 25 e 26 do arquivo localizado em _helpers\db.js.
- Ele irá adicionar um usuário padrão denominado "Admin", assim será possível gerar o token de autenticação para cadastrar outros usuários.

```bash
# Clonar o repositório
git clone https://github.com/GlauciaLS/kokimbos-sistoque

# Acessar a pasta de backend
cd backend

# Baixar as dependências
npm install

# Subir o servidor
npm start
```

<h2> Observações </h2>

- Na pasta "postman" desse repositório, há uma collection e dois environments que podem ser importados e utilizados para fins de testes. 
- Por questões de segurança, todas as requisições requerem um token de autenticação que deve ser gerado na request "Usuário/Autenticar usuário" dessa mesma collection. Basta passar no corpo da request o login e senha.
- Portanto, deve-se solicitar o token e copiá-lo do corpo da response, respectivamente o atributo "token". Para adicioná-lo nas requests, em cada uma delas é necessário acessar a aba "Auth" ou "Authorization", selecionar a opção "Bearer token" e colar o token no campo que aparecerá logo a direita. Após esses passos, será possível fazer a request corretamente.