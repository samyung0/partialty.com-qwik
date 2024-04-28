import { DocumentHead } from "@builder.io/qwik-city";

export const documentHead: DocumentHead = {
  title: 'Partialty',
  meta: [
    {
      name: 'og:title',
      content: 'Partialty',
    },
    {
      name: 'twitter:title',
      content: 'Partialty',
    },
    {
      name: "og:image",
      content: "https://i.ibb.co/RjHKTwf/thumbnail.png",
    },
    {
      name: "twitter:image",
      content: "https://i.ibb.co/RjHKTwf/thumbnail.png"
    },
    {
      name: 'description',
      content: `Partialty is an e-learning platform that teaches web development in the most simplest words possible and we mostly target beginners and intermediate developers. The courses are voice overed and there are beautiful highlights alongside. The most important part? They are free!`,
    },
    {
      name: 'og:description',
      content: `Partialty is an e-learning platform that teaches web development in the most simplest words possible and we mostly target beginners and intermediate developers. The courses are voice overed and there are beautiful highlights alongside. The most important part? They are free!`,
    },
    {
      name: 'twitter:description',
      content: `Partialty is an e-learning platform that teaches web development in the most simplest words possible and we mostly target beginners and intermediate developers. The courses are voice overed and there are beautiful highlights alongside. The most important part? They are free!`,
    },
  ],
  links: [
    {
      rel: 'canonical',
      href: 'https://www.partialty.com',
    },
  ],
};