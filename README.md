                                          ------------------- Site de Receitas----------------------

--> Aplicação web desenvolvida com o objetivo de praticar desenvolvimento front-end e integração com API REST simulada.
_______________________________________________________________________________________________________________________________________________________________________________

--> Tecnologias utilizadas:
HTML5;
CSS3;
JavaScript;
JSON Server;
Git e GitHub.

_______________________________________________________________________________________________________________________________________________________________________________

---> Funcionalidades:

Listagem de receitas a partir de API local;
Cadastro e exclusão de receitas (perfil admin);
Sistema de login com controle de permissões por perfil;
Adição de receitas aos favoritos ao fazer login;
Barra de busca para filtragem dinâmica de receitas;
Atualização dinâmica da interface (manipulação do DOM);
Layout responsivo.

_______________________________________________________________________________________________________________________________________________________________________________

--> Autenticação e Controle de Acesso

O sistema possui autenticação simulada com dois perfis:

Admin: pode cadastrar e excluir receitas; Pode adicionar receitas aos favoritos.
Usuário: pode visualizar receitas; Pode adicionar receitas aos favoritos.

A sessão é mantida utilizando localStorage, permitindo controle de permissões no front-end.

Usuários disponíveis para teste:

admin | senha: 123
user  | senha: 123

_______________________________________________________________________________________________________________________________________________________________________________

O projeto utiliza o JSON Server para simular uma API REST local, permitindo a realização de requisições HTTP (GET, POST, PUT, DELETE).

_______________________________________________________________________________________________________________________________________________________________________________

--> Para iniciar a API:
npx json-server --watch db/db.json --port 3000
