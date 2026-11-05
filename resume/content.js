/* ============================================================
   resume.bfloore.online — modular resume.
   Remix chips only: General, AI trainer, Business owner / freelancer.
   Each module has a `full` variant (used by the full CV view) and
   a shorter variant where a remix should stay light.
   Edit the words here. Preset membership is which sections start on.
   ============================================================ */

const identity = {
  line: 'Writer, composer, producer; AI data trainer; remote professional.'
};

const remixes = [
  {
    id: 'general',
    label: 'General',
    deck: 'General resume, at a glance.'
  },
  {
    id: 'ai',
    label: 'AI trainer',
    deck: 'Remix for AI training and auditing.'
  },
  {
    id: 'freelance',
    label: 'Business owner / freelancer',
    deck: 'Remix for the business and freelance practice.'
  }
];

/* Section order is the order of this array. Presets list ids; the UI
   always displays them in this order. */
const modules = [
  {
    id: 'summary',
    label: 'Summary',
    title: 'Summary',
    kind: 'prose',
    variants: {
      blend: {
        paragraphs: [
          'AI data trainer and auditor with 5+ years in safety labeling, preference ranking, and output auditing, and an independent operator of personal brands and digital properties including bfloore.online and reviews.bfloore.online. Remote support lead and multi-channel service pro, working from Jacksonville, FL.'
        ]
      },
      ai: {
        paragraphs: [
          'AI data trainer and auditor with 5+ years supporting LLMs through safety labeling, preference ranking, and output auditing. Extensive background in content moderation, RLHF workflows, and guideline-based evaluation — including exposure to explicit, toxic, and psychologically disturbing content. High accuracy, emotional resilience, consistent performance across 100+ remote projects.'
        ]
      },
      freelance: {
        paragraphs: [
          'Independent operator building and running personal brands and digital properties (bfloore.online, reviews.bfloore.online, creative/serial projects, merch), while contracting as an AI trainer, remote support lead, and multi-channel service pro. Comfortable owning roadmap, publishing cadence, affiliate/ops hygiene, and client-facing delivery without a corporate scaffold.'
        ]
      },
      full: {
        paragraphs: [
          'AI data trainer and auditor with 5+ years supporting LLMs through safety labeling, preference ranking, and output auditing. Extensive background in content moderation, RLHF workflows, and guideline-based evaluation — including exposure to explicit, toxic, and psychologically disturbing content. High accuracy, emotional resilience, consistent performance across 100+ remote projects.',
          'Independent operator building and running personal brands and digital properties (bfloore.online, reviews.bfloore.online, creative/serial projects, merch), while contracting as an AI trainer, remote support lead, and multi-channel service pro. Comfortable owning roadmap, publishing cadence, affiliate/ops hygiene, and client-facing delivery without a corporate scaffold.'
        ]
      }
    }
  },
  {
    id: 'exp-ai',
    label: 'AI experience',
    title: 'Experience',
    kind: 'roles',
    variants: {
      light: {
        kicker: 'AI training & auditing',
        entries: [
          { title: 'Auditor | AI Model Trainer (SME)', org: 'Handshake AI', where: 'Remote', dates: '2025–Present' },
          {
            title: 'Auditor | AI Model Trainer', org: 'Mercor AI', where: 'Remote', dates: '2025–2026',
            bullets: ['Audit educational, tutoring, and conversational output for accuracy, safety, and guideline fit, including multimodal review.']
          },
          {
            title: 'Team Lead | Auditor', org: 'Appen / CrowdGen', where: 'Remote', dates: '2018–2024',
            bullets: ['Led evaluation across two dozen+ projects: UGC and AI output, annotation, collection, and QA for LLM training.']
          },
          {
            title: 'AI Model Trainer', org: 'Various contracts', where: 'Remote', dates: '2019–Present',
            bullets: ['Speech collection lead, healthcare SME/QA, annotation, transcription, and safety moderation across contract projects.']
          },
          {
            title: 'Standardized Test Scorer', org: 'Pearson Education', where: 'Remote', dates: '2022–Present',
            bullets: ['50,000+ open-ended responses; 60+/hr at 90–95% inter-rater reliability.']
          }
        ]
      },
      supporting: {
        kicker: 'Supporting contracts',
        entries: [
          {
            title: 'AI Model Trainer & Auditor',
            org: 'Handshake AI, Mercor AI, and other contracts',
            where: 'Remote',
            dates: '2018–Present',
            bullets: [
              'Safety labeling, preference ranking, output auditing, and multimodal review across long-running and single-use projects.',
              'Team lead and auditor at Appen / CrowdGen (2018–2024). Speech collection lead (Neevo/DefinedCrowd); healthcare SME/QA (Centific); annotator (RWS Moravia, Mindrift); transcriptionist (Lionbridge). Mercor AI, 2025–2026. Handshake AI, 2025–Present.'
            ]
          },
          {
            title: 'Standardized Test Scorer', org: 'Pearson Education', where: 'Remote', dates: '2022–Present',
            bullets: ['50,000+ open-ended responses; 60+/hr at 90–95% inter-rater reliability.']
          }
        ]
      },
      full: {
        kicker: 'AI training & auditing',
        entries: [
          { title: 'Auditor | AI Model Trainer (SME)', org: 'Handshake AI', where: 'Remote', dates: '2025–Present' },
          {
            title: 'Auditor | AI Model Trainer', org: 'Mercor AI', where: 'Remote', dates: '2025–2026',
            bullets: [
              'Audit and evaluate AI educational, tutoring, and conversational content for accuracy, safety, and guideline compliance.',
              'Rank and correct model outputs; audit for logic, tone, and learning-outcome alignment.',
              'Multimodal review (text, image, video, speech).'
            ]
          },
          {
            title: 'Team Lead | Auditor', org: 'Appen / CrowdGen', where: 'Remote', dates: '2018–2024',
            bullets: [
              'UGC and AI output evaluation across two dozen+ full-time and near-full-time projects.',
              'Annotated, collected, and QA\'d data for LLM training.'
            ]
          },
          {
            title: 'AI Model Trainer', org: 'Various contracts', where: 'Remote', dates: '2019–Present',
            bullets: [
              'Project Lead, Speech Collection (Neevo/DefinedCrowd); Healthcare SME/QA (Centific); Annotator (RWS Moravia, Mindrift); Transcriptionist (Lionbridge).',
              'Safety flagging and moderation on explicit, adversarial, and distressing material across 100+ part-time and single-use projects.'
            ]
          },
          {
            title: 'Standardized Test Scorer', org: 'Pearson Education', where: 'Remote', dates: '2022–Present',
            bullets: ['50,000+ open-ended responses; 60+/hr at 90–95% inter-rater reliability.']
          }
        ]
      }
    }
  },
  {
    id: 'exp-cs',
    label: 'Customer service',
    title: 'Customer service',
    kind: 'roles',
    variants: {
      select: {
        kicker: 'Client operations',
        entries: [
          { title: 'Crisis & Service Referral Specialist', org: 'Direct Interactions', where: 'Remote', dates: '2021–2022' },
          { title: 'Live Chat Sales Agent', org: 'Samsung.com Mobile via ibbu', where: 'Remote', dates: '2021–Present' },
          { title: 'Reservationist / Group Sales', org: 'HotelPlanner.com', where: 'Remote', dates: '2020–2023' },
          { title: 'Donor Services', org: 'ACD Direct for PBS/NPR', where: 'Remote', dates: '2019–2022' }
        ]
      },
      full: {
        kicker: 'Crisis, chat, reservations, donor services',
        entries: [
          { title: 'Crisis & Service Referral Specialist', org: 'Direct Interactions', where: 'Remote', dates: '2021–2022' },
          { title: 'Live Chat Sales Agent', org: 'Samsung.com Mobile via ibbu', where: 'Remote', dates: '2021–Present' },
          { title: 'Reservationist / Group Sales', org: 'HotelPlanner.com', where: 'Remote', dates: '2020–2023' },
          { title: 'Donor Services', org: 'ACD Direct for PBS/NPR', where: 'Remote', dates: '2019–2022' },
          { title: 'Seasonal support', org: 'Omaha Steaks; Ubisoft & Pole-to-Win', where: 'Remote', dates: 'Seasonal', bullets: ['Player support (Ubisoft & Pole-to-Win) and seasonal work for Omaha Steaks.'] }
        ]
      }
    }
  },
  {
    id: 'clinical',
    label: 'Clinical',
    title: 'Clinical background',
    kind: 'roles',
    variants: {
      full: {
        entries: [
          { title: 'Staff Critical Care RN | Incident Commander | Preceptor', org: 'Baptist Health Jacksonville', dates: '2011–2019' },
          {
            title: 'Healthcare SME & QA Analyst', org: 'Centific / Pactera Edge', dates: '2022–2023',
            bullets: ['Clinical AI chatbot validation.']
          }
        ]
      }
    }
  },
  {
    id: 'projects',
    label: 'Projects',
    title: 'Projects & properties',
    kind: 'items',
    variants: {
      light: {
        entries: [
          { title: 'bfloore.online', href: 'https://www.bfloore.online', text: 'Personal hub for creative work, professional modules, and merch.' },
          { title: 'reviews.bfloore.online', href: 'https://reviews.bfloore.online', text: 'Affiliate review site with a static build and a publishing workflow.' },
          { title: 'Creative and product work', text: 'Musicals, fiction, Friendly Robots, and apps listed on the hub.' }
        ]
      },
      full: {
        entries: [
          { title: 'bfloore.online', href: 'https://www.bfloore.online', text: 'Personal hub (creative, professional modules, merch).' },
          { title: 'reviews.bfloore.online', href: 'https://reviews.bfloore.online', text: 'Affiliate review site (static build, publishing workflow).' },
          { title: 'Creative work', text: 'Musicals, fiction, visual media, and Friendly Robots children\'s books.' },
          { title: 'Serial Images and other apps', text: 'Listed on the hub.' },
          { title: 'Ongoing publishing', text: 'Multi-platform content and ops.' }
        ]
      }
    }
  },
  {
    id: 'education',
    label: 'Education',
    title: 'Education',
    kind: 'credentials',
    variants: {
      full: {
        entries: [
          { title: 'B.S., M.S. in Nursing (Education)', org: 'Jacksonville University', notes: 'Cum Laude, Sigma Theta Tau', dates: '2013–2018' },
          { title: 'B.A. Urban Planning, Public Admin', org: 'Miami University (Ohio)', notes: 'Cum Laude, Presidential Service Award', dates: '2000–2004' },
          { title: 'Certificate, Hospitality & Tourism Management', org: 'FAU', dates: '2020' },
          { title: 'Certificate, Modern Management Tools', org: 'USF', dates: '2020' }
        ]
      }
    }
  },
  {
    id: 'skills-ai',
    label: 'AI skills',
    title: 'Skills — AI',
    kind: 'skills',
    variants: {
      core: {
        items: [
          'Safety labeling and moderation',
          'Preference ranking and RLHF',
          'Multimodal annotation',
          'Rubric-based evaluation and inter-rater reliability',
          'Remote async work'
        ]
      },
      full: {
        items: [
          'Tools and technical workflow',
          'HIPAA',
          'Safety labeling and moderation',
          'Preference ranking',
          'RLHF',
          'Multimodal annotation',
          'Rubric-based evaluation',
          'Inter-rater reliability',
          'Remote async work'
        ]
      }
    }
  },
  {
    id: 'skills-ops',
    label: 'Operator skills',
    title: 'Skills — operator',
    kind: 'skills',
    variants: {
      core: {
        items: [
          'Publishing and site ops',
          'Affiliate hygiene',
          'Multi-channel client delivery (chat, phone, email)',
          'Brand ownership',
          'Remote reliability'
        ]
      },
      full: {
        items: [
          'Publishing and site ops',
          'Affiliate hygiene',
          'Multi-channel client delivery (chat, phone, email)',
          'CRM familiarity',
          'Content systems',
          'Brand ownership',
          'Sales conversion',
          'Remote reliability'
        ]
      }
    }
  }
];

/* Which variant a remix shows when that module is visible.
   Turning a section on never invents a fourth remix; it uses this map.
   The full CV view always uses `full`. */
const variantMap = {
  summary: { general: 'blend', ai: 'ai', freelance: 'freelance' },
  'exp-ai': { general: 'light', ai: 'full', freelance: 'supporting' },
  'exp-cs': { general: 'full', ai: 'full', freelance: 'select' },
  clinical: { general: 'full', ai: 'full', freelance: 'full' },
  projects: { general: 'light', ai: 'light', freelance: 'full' },
  education: { general: 'full', ai: 'full', freelance: 'full' },
  'skills-ai': { general: 'core', ai: 'full', freelance: 'full' },
  'skills-ops': { general: 'core', ai: 'full', freelance: 'full' }
};

/* General: blended summary, light AI experience, light projects,
   education, core skills. Customer service off. Clinical off.
   AI trainer: AI summary, full AI experience, light projects, AI skills,
   education. Customer service and clinical off. Operator skills off.
   Freelancer: freelance summary, full projects, operator skills,
   selected client-ops roles, education, AI experience as support. */
const presets = {
  general: ['summary', 'exp-ai', 'projects', 'education', 'skills-ai', 'skills-ops'],
  ai: ['summary', 'exp-ai', 'projects', 'education', 'skills-ai'],
  freelance: ['summary', 'exp-ai', 'exp-cs', 'projects', 'education', 'skills-ops']
};

module.exports = {
  identity: identity,
  remixes: remixes,
  modules: modules,
  variantMap: variantMap,
  presets: presets,
  moduleIds: modules.map(function (m) { return m.id; })
};
