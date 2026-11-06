export type Project = {
  id: string;
  name: string;
  short: string;
  cat: string;
  year: string;
  href: string;
  host: string;
  image: string;
  detail: string;
  note: string;
  tint: string;
  letter: string;
};

export const PROJECTS: Project[] = [
  {
    id: "canby",
    name: "Canby Community Clinic",
    short: "Canby Clinic",
    cat: "Healthcare",
    year: "2026",
    href: "https://puravidacc.org",
    host: "puravidacc.org",
    image: "/sites/canby.jpg?v=2",
    detail: "/sites/canby-detail.jpg?v=2",
    note: "A patient site with the quiet of an early clinic.",
    tint: "#e7efe8",
    letter: "C",
  },
  {
    id: "citium",
    name: "Citium Roofing",
    short: "Citium Roofing",
    cat: "Home services",
    year: "2026",
    href: "https://citiumroofing.com",
    host: "citiumroofing.com",
    image: "/sites/citium.jpg?v=2",
    detail: "/sites/citium-detail.jpg?v=2",
    note: "A light, exact site for a roofing practice.",
    tint: "#ece7df",
    letter: "R",
  },
  {
    id: "clean",
    name: "Extreme Quality Clean",
    short: "Extreme Quality Clean",
    cat: "Home services",
    year: "2026",
    href: "https://extremequalityclean.com",
    host: "extremequalityclean.com",
    image: "/sites/clean.jpg?v=2",
    detail: "/sites/clean-detail.jpg?v=2",
    note: "Service branding as considered as the rooms it leaves behind.",
    tint: "#e5eee9",
    letter: "E",
  },
  {
    id: "rarescore",
    name: "RareScore",
    short: "RareScore",
    cat: "Product",
    year: "2026",
    href: "https://myrarescore.com",
    host: "myrarescore.com",
    image: "/sites/rarescore.jpg?v=2",
    detail: "/sites/rarescore-detail.jpg?v=2",
    note: "A product instrument. Exact type, nothing past the mark.",
    tint: "#e6e9ef",
    letter: "S",
  },
  {
    id: "plumbing",
    name: "My Plumbing Inc",
    short: "My Plumbing Inc",
    cat: "Home services",
    year: "2026",
    href: "https://myplumbinginc.com",
    host: "myplumbinginc.com",
    image: "/sites/plumbing.jpg?v=2",
    detail: "/sites/plumbing-detail.jpg?v=2",
    note: "A high-contrast site for a working contractor.",
    tint: "#e6e8ef",
    letter: "P",
  },
  {
    id: "rooter",
    name: "Extreme Plumbing & Rooter",
    short: "Extreme Plumbing",
    cat: "Home services",
    year: "2026",
    href: "https://rooter-plumber.com",
    host: "rooter-plumber.com",
    image: "/sites/rooter.jpg?v=2",
    detail: "/sites/rooter-detail.jpg?v=2",
    note: "A direct plumbing site, built to be called.",
    tint: "#f3e8e6",
    letter: "X",
  },
];

export function getProject(id: string) {
  return PROJECTS.find((project) => project.id === id);
}
