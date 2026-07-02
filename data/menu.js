/*
  MACEIÓ DETOX — dados do cardápio
  ---------------------------------
  Este arquivo é gerado/atualizado pelo painel admin (admin.html).
  Para atualizar o cardápio do site:
    1. Abra admin.html no navegador
    2. Faça as alterações (adicionar/editar/remover pratos, trocar fotos)
    3. Clique em "Baixar menu.js atualizado"
    4. Envie o arquivo baixado por FTP para dentro da pasta /data,
       substituindo este arquivo.
  Não é necessário nenhum banco de dados ou servidor.
*/

window.MENU_DATA = {
  "loja": {
    "nome": "Maceió Detox",
    "slogan": "Sabor de verdade, leveza de verdade",
    "whatsapp": "5582900000000",
    "endereçoResumo": "Maceió, AL",
    "horario": "Seg a Sáb · 08h às 20h"
  },
  "categorias": [
    { "id": "sucos", "nome": "Sucos e Caldos" },
    { "id": "marmitas", "nome": "Marmita Fit" },
    { "id": "saladas", "nome": "Combo Detox" },
    { "id": "sobremesas", "nome": "Sobremesa Fit" }
  ],
  "pratos": [
    {
      "id": "p1",
      "categoria": "sucos",
      "nome": "Suco Verde Detox",
      "descricao": "Couve, limão, gengibre, maçã verde e água de coco.",
      "preco": 12.90,
      "foto": "",
      "tags": ["vegano", "sem glúten"]
    },
    {
      "id": "p2",
      "categoria": "sucos",
      "nome": "Vitamina de Maracujá",
      "descricao": "Maracujá, banana, aveia e leite de amêndoas.",
      "preco": 13.90,
      "foto": "",
      "tags": ["vegetariano"]
    },
    {
      "id": "p3",
      "categoria": "marmitas",
      "nome": "Marmita Frango Grelhado",
      "descricao": "Frango grelhado, arroz integral, brócolis e batata doce.",
      "preco": 25.90,
      "foto": "",
      "tags": ["fit", "sem glúten"]
    },
    {
      "id": "p4",
      "categoria": "marmitas",
      "nome": "Marmita Vegana do Dia",
      "descricao": "Grão de bico, quinoa, legumes assados e molho tahine.",
      "preco": 24.90,
      "foto": "",
      "tags": ["vegano", "fit"]
    },
    {
      "id": "p5",
      "categoria": "saladas",
      "nome": "Bowl Tropical",
      "descricao": "Folhas verdes, manga, quinoa, castanhas e vinagrete de maracujá.",
      "preco": 22.90,
      "foto": "",
      "tags": ["vegano"]
    },
    {
      "id": "p6",
      "categoria": "saladas",
      "nome": "Salada Caesar Fit",
      "descricao": "Alface americana, frango grelhado, croutons integrais e molho leve.",
      "preco": 23.90,
      "foto": "",
      "tags": ["fit"]
    },
    {
      "id": "p7",
      "categoria": "sobremesas",
      "nome": "Mousse de Cacau 70%",
      "descricao": "Mousse de cacau com abacate, adoçado com tâmaras.",
      "preco": 11.90,
      "foto": "",
      "tags": ["vegano", "sem açúcar"]
    },
    {
      "id": "p8",
      "categoria": "sobremesas",
      "nome": "Pudim de Chia com Frutas",
      "descricao": "Chia hidratada no leite de coco com frutas vermelhas.",
      "preco": 12.90,
      "foto": "",
      "tags": ["vegano", "sem glúten"]
    }
  ]
};
