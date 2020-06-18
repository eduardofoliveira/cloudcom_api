# API Basix - Cloud Comunicação

Esta API é responsável por fazer a integração do PBX Basix com sistemas de terceiros.
Atualmente estão disponíveis por esta API:

- **Pipedrive**
- **Basix Contact**
- **Zoho Desk**

O que a integração contempla:

**Screen Popup** Exibir em tela os dados da chamada corrente que esta chamando ou que foi atendida pelo operador.

**Transferência de Gravação** Faz o upload ou disponibiliza um link para fazer o download da gravação no CRM ao qual foi integrado.


# Como fazer o deploy

1° - Clonar o repositório:
https://github.com/eduardofoliveira/cloudcom_api.git

2° - copiar o arquivo **.env.example** no arquivo **.env** e preencher as variáveis

3° - roda o comando **yarn build** ou **npm run build**

4° executar com o comando **node dist/server.js**

5° colocar em produção com pm2 **pm2 dist/server.js**

## Fluxo de funcionamento
Durante o **RING** ou no **ATENDIMENTO**

```mermaid
sequenceDiagram
Basix ->> API: Call details
API -->> Basix: 200 OK
API ->> Terceiro: Call details
Terceiro -->> API: 200 OK
```
Ao termino do processamento da gravação:

```mermaid
sequenceDiagram
Basix ->> API: Recording
API -->> Basix: 200 OK
API ->> Terceiro: Recording
Terceiro -->> API: 200 OK
```
