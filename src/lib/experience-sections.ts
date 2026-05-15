export const EXPERIENCE_SECTIONS = [
  {
    id: "pasadias",
    label: "Pasadías",
    title: "Pasadías",
    subtitle:
      "Experiencias de un día para disfrutar playas, naturaleza, aventura y cultura.",
  },
  {
    id: "nacionales",
    label: "Destinos nacionales",
    title: "Destinos nacionales",
    subtitle:
      "Viajes de varios días por Colombia, organizados para descubrir nuevos destinos.",
  },
  {
    id: "internacionales",
    label: "Internacionales",
    title: "Internacionales",
    subtitle:
      "Escapadas fuera de Colombia con enfoque en descanso, playa y experiencias memorables.",
  },
  {
    id: "grupales",
    label: "Grupales",
    title: "Grupales",
    subtitle:
      "Viajes de un día para grupos, equipos, familias y comunidades.",
  },
  {
    id: "tours",
    label: "Tours",
    title: "Tours",
    subtitle:
      "Experiencias y actividades cortas para complementar tu estadía en la ciudad.",
  },
] as const;

export type ExperienceSectionId = (typeof EXPERIENCE_SECTIONS)[number]["id"];

export const DEFAULT_EXPERIENCE_SECTION: ExperienceSectionId = "pasadias";

export function getExperienceSection(id: string | null | undefined) {
  return (
    EXPERIENCE_SECTIONS.find((section) => section.id === id) ??
    EXPERIENCE_SECTIONS[0]
  );
}
