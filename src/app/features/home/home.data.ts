export interface Editorial {
  tag: string;
  title: string;
  text: string;
  imageUrl: string;
}
 
export const EDITORIALS: Editorial[] = [
  {
    tag: 'FLAMENGO',
    title: 'Origem das cores',
    text: 'O vermelho e preto do Flamengo foram "roubados" do remo! As cores foram adotadas em 1895 vindas da seção de remo do clube, que já usava esse padrão. Só em 1916 o futebol abraçou definitivamente o icônico manto rubro-negro com as listras horizontais.',
    imageUrl: 'https://vozdoninho.com.br/wp-content/uploads/2024/12/bandeira-Flamengo.jpg'
  },
  {
    tag: 'PALMEIRAS',
    title: 'Herança Italiana',
    text: 'O verde do Palmeiras tem raízes na imigração italiana. O clube foi fundado em 1914 por imigrantes italianos como "Palestra Itália" e usava as cores da bandeira italiana. Após a II Guerra Mundial, em 1942, o nome mudou para Palmeiras e o verde foi mantido como símbolo de identidade.',
    imageUrl: 'https://i.pinimg.com/originals/66/64/93/666493c87e272fd9f704640145ec4876.jpg'
  },
  {
    tag: 'SÃO PAULO',
    title: 'O tricolor e a cidade',
    text: 'As três listras do uniforme do São Paulo — branca, vermelha e preta — representam as três raças formadoras da cidade de São Paulo. O apelido "Tricolor Paulista" vem exatamente dessas três cores que, juntas, formam uma identidade única e histórica do clube fundado em 1930.',
    imageUrl: 'https://wallpapers4screen.com/Uploads/12-4-2025/72728/thumb2-4k-sao-paulo-fc-logo-brazilian-serie-a-red-black-white-silk-texture-sao-paulo-fc-flag.jpg'
  },
  {
    tag: 'CORINTHIANS',
    title: 'Inspiração inglesa',
    text: 'O nome e o uniforme branco e preto do Corinthians são uma homenagem ao Corinthian FC, time amador inglês que visitou o Brasil em 1910 e encantou os operários paulistanos. O clube foi fundado em 1910 por trabalhadores humildes que queriam ter seu próprio time, inspirado nos visitantes.',
    imageUrl: 'https://wallpapers4screen.com/Uploads/15-8-2023/61427/thumb2-4k-corinthians-logo-black-white-silk-fabric-brazilian-football-team-corinthians-emblem.jpg'
  }
];