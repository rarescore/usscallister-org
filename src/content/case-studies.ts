export type CaseStudy = {
  id: string;
  problem: string;
  approach: string[];
  shipped: string[];
  journal?: string;
  service?: string;
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  canby: {
    id: "canby",
    problem:
      "People looking for a clinic in Reseda decide before they call. The site had to answer what the clinic does, who it is for, and how to start, without the noise of a hospital template.",
    approach: [
      "The page order follows the questions a first visit raises: services, what to expect, and how to reach the clinic.",
      "The visual tone stays quiet. Type, space, and photography do the work instead of stock medical icons.",
    ],
    shipped: [
      "A patient-facing site at puravidacc.org",
      "A clear path from the first screen to contact",
      "Copy structured around booking questions, not a generic services grid",
    ],
    journal: "web-design-for-medical-clinics-los-angeles",
    service: "/web-design-medical-clinics",
  },
  citium: {
    id: "citium",
    problem:
      "Roofing searches in Glendale and Los Angeles are specific. The site needed to say what Citium does, where it works, and how to ask for an inspection, without looking like a lead-form template.",
    approach: [
      "The layout is light and exact. Service area and the next step stay visible.",
      "Photography and type carry the trade. Nothing on the page pretends a visit is already booked.",
    ],
    shipped: [
      "A live site at citiumroofing.com",
      "Service-area framing for Glendale and Los Angeles",
      "A direct inquiry path for inspections",
    ],
    journal: "web-design-for-roofing-contractors-los-angeles",
    service: "/web-design-roofing-contractors",
  },
  clean: {
    id: "clean",
    problem:
      "Airbnb hosts need to understand turnover, timing, and what is included before they book. A vague cleaning homepage loses that decision.",
    approach: [
      "The site explains the service in the order a host asks: what happens, what it costs to consider, and how to start.",
      "The visual system is as considered as the rooms the crew leaves behind.",
    ],
    shipped: [
      "A live site at extremequalityclean.com",
      "Service copy written around turnover, not generic maid language",
      "A straightforward way to inquire",
    ],
    journal: "web-design-for-airbnb-cleaning-los-angeles",
    service: "/web-design-airbnb-cleaning",
  },
  rarescore: {
    id: "rarescore",
    problem:
      "RareScore is a product, not a local service page. The site had to introduce the instrument with exact type and almost no decoration.",
    approach: [
      "The mark, the name, and one clear explanation do the work.",
      "Nothing on the page competes with the product itself.",
    ],
    shipped: [
      "A live site at myrarescore.com",
      "A restrained product presentation",
      "A short path from the mark to the offer",
    ],
    journal: "what-makes-a-50000-website-worth-it",
    service: "/web-design-los-angeles",
  },
  plumbing: {
    id: "plumbing",
    problem:
      "A working contractor needs the phone number, the service area, and the kind of job understood immediately. Decorative layouts get in the way of an emergency call.",
    approach: [
      "High contrast, short lines, and the offer up front.",
      "The page is built for someone on a phone who already has a problem.",
    ],
    shipped: [
      "A live site at myplumbinginc.com",
      "A high-contrast layout for a working contractor",
      "Contact that does not sit under a long story",
    ],
    journal: "web-design-for-plumbing-contractors-san-fernando-valley",
    service: "/web-design-plumbing-contractors",
  },
  rooter: {
    id: "rooter",
    problem:
      "Extreme Plumbing & Rooter is called when something has already failed. The site should be direct enough to dial, not a brochure.",
    approach: [
      "The first screen states the trade and the way to reach the company.",
      "Supporting pages explain the work without burying the number.",
    ],
    shipped: [
      "A live site at rooter-plumber.com",
      "A direct plumbing site built to be called",
      "Service language a homeowner can scan on a phone",
    ],
    journal: "web-design-for-plumbing-contractors-san-fernando-valley",
    service: "/web-design-plumbing-contractors",
  },
};
