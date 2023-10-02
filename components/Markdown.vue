<script setup>
import { marked } from "marked";


const props = defineProps({
  source: {
    type: String,
    default: `# Contexto

Em cenários que se faz necessário reter a atenção do usuário sobre alguma informação, utilizaremos alerta de notificação.

# Comportamento Atual

Não há nenhum alerta de notificação visual implementado.

# Comportamento Esperado

Um componente que possa ser instânciado quando necessário e exiba as informações fornecidas como:

- **Título** : Texto que vai ficar em destaque no alerta
- **Corpo** : Corpo descritivo do alerta
- **Ícone** : Ícone exibido no alerta
- **Estilo** : Estilo predefinido entre (\`danger\`,\`info\`,\`success\`,\`warning\`,\`neutral\`)

O componente deve conter um botão de fechar (x) segundo o protótipo do Figma. Ao clicar, o componente além de omitido com animação deve ser **destruído**, a fim de evitar perda de desempenho no aplicativo.

# Protótipos

### danger
![image](/uploads/8b791e62c23f3d8cc986d9ff4286a6c9/image.png)

### info
![image](/uploads/92dc248505bd90d6c44bcbe4f9331bc6/image.png)

### success

![image](/uploads/6cd2edc1dd8115535bf93c0c7023cc11/image.png)

### warning

![image](/uploads/e39f8287e19862a423c8e8ecc7cd771c/image.png)

### neutral

![image](/uploads/609e39a3f198d24b6a9a397c25ebcb18/image.png)

# Sugestões para o Desenvolvimento

- Efetuar a criação de um componente que receba as informações acima como parâmetros, o estilo pode ser definido por padrão no \`neutral\` caso haja uma ausência desse parâmetro. O Título, Corpo e Ícone não são opcionais, devem sempre estar presentes. (Fica a cargo do desenvolvedor decidir se é interessante deixar Título, Corpo e Ícone com algum valor padrão ou não.)
- Adicionar parâmetro ao componente que possibilite o controle se o componente será dispensado automaticamente ou não
- Adicionar parâmetro ao componente que possibilite o controle o tempo de exibição do alerta`
  }
});


</script>
<template>
  <div
    v-html="marked(props.source.replaceAll('/uploads', 'https://gitlab.icolabora.com.br/mdp/mdp-pets/kanban/uploads'))" />
</template>