type Tech =
  | "TS"
  | "TailwindCSS"
  | "Next.js"
  | "Node.js"
  | "Express"
  | "Fastify"
  | "Prisma"
  | "Bun"
  | "ElysiaJS"
  | "Puppeteer"
  | "Fly.io"
  | "Vercel"
  | "SQL"
  | "PostgreSQL"
  | "Supabase"
  | "MongoDB";
type Project = {
  title: string;
  description: string;
  techs: Tech[];
  live?: string;
  source: string;
  image?: string;
  hasAnchorOnImage: boolean;
};

export const projects: Project[] = [
  {
    title: "Tcg Simulator",
    description:
      "O TCGSim é uma plataforma onde você pode colecionar, trocar e batalhar com cartas Pokémon de forma gratuita. Junte-se à comunidade de treinadores e comece sua jornada!",
    image: "/projects/tcgsim.png",
    hasAnchorOnImage: true,
    live: "https://www.tcgsim.com/",
    source: "https://github.com/CaioHVectorA/tcg-api",
    techs: [
      "TS",
      "ElysiaJS",
      "Bun",
      "PostgreSQL",
      "Supabase",
      "Next.js",
      "Vercel",
      "Fly.io",
    ],
  },
  {
    title: "StoreHub",
    description:
      "O StoreHub é um sistema de gerenciamento de estoque e vendas para pequenos negócios. Ele foi resultado de um desafio de desenvolver um backend com o mínimo de dependências possíveis. E eu consegui! Ele possui 0 dependências.",
    hasAnchorOnImage: false,
    source: "https://github.com/CaioHVectorA/StoreHub",
    techs: ["Bun", "Fly.io"],
  },
];
