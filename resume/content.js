/* ============================================================
   resume.bfloore.online — modular resume.
   Remix chips: General, AI trainer, Business owner / freelancer,
   Health / education, Remote support / crisis, Content creation.
   Each module has a `full` variant (used by the full CV view) and
   a shorter variant where a remix should stay light.
   Edit the words here. Preset membership is which sections start on.
   ============================================================ */

/* Shared by the exp-cs `crisis` variant and by `full` (full also keeps seasonal work). */
const crisisServiceRoles = [
  {
    title: 'Crisis & Service Referral Specialist',
    org: 'Direct Interactions',
    where: 'Remote',
    dates: '2021–2022',
    bullets: [
      'Navigated clients through emergency housing, substance-use recovery, and mental health systems using trauma-informed, person-centered practice.',
      'Triaged high-risk cases (self-harm, suicidal ideation, interpersonal violence) and escalated per protocol while preserving client dignity.',
      'Trained in crisis communication, diversity/equity, motivational interviewing, and mental health first aid.'
    ]
  },
  {
    title: 'Live Chat Sales Agent',
    org: 'Samsung.com Mobile via ibbu',
    where: 'Remote',
    dates: '2021–Present',
    bullets: [
      'Direct engagement and sales via live chat across Black Friday/Cyber Monday peaks and international product launches.',
      'High-volume e-commerce support with personalized interactions.'
    ]
  },
  {
    title: 'Reservationist / Group Sales',
    org: 'HotelPlanner.com',
    where: 'Remote',
    dates: '2020–2023',
    bullets: [
      'Inbound reservations for a major hotel booking company; navigated multiple booking systems.',
      'Department recognition for conversion and service metrics; de-escalated angry/crisis guests.'
    ]
  },
  {
    title: 'Donor Services',
    org: 'ACD Direct for PBS/NPR',
    where: 'Remote',
    dates: '2019–2022',
    bullets: ['Phone-based donor support and inbound fundraising.']
  }
];

/* Detailed creative catalog. The full CV and the creative remix share it.
   The freelancer remix uses a shorter practice list instead. */
const creativePortfolio = [
  {
    title: 'FRIENDLY ROBOTS!',
    href: 'https://friendlyrobots.online',
    text: 'Children\'s coloring, activity, and storytime series (STEM/SEL). A series of published titles on Amazon, with expansions on Gumroad.',
    links: [{ href: 'https://www.amazon.com/stores/B.-Floore/author/B0D2DBX9BH', label: 'Amazon author store' }]
  },
  { title: 'Benny', text: 'Published novella.' },
  {
    title: 'The Lying Liars',
    href: 'https://thelyingliars.online',
    text: 'Semi-autobiographical novel in editing (160k+ words), with podcast chapters on the site.'
  },
  { title: 'SLOP!', href: 'https://slopthemusical.com', text: 'Musical in progress.' },
  { title: 'Geoff & Maxie', text: 'Musical in progress.' },
  { title: 'spun', href: 'https://spuncalliope.wordpress.com', text: 'Musical in progress.' },
  {
    title: 'Cultivating Ethical AI',
    href: 'https://open.spotify.com/show/2nGTlVMwCufnCq4NUssGT9',
    text: 'Sci-fi ethics podcast in season 4. Show notes report an Apple Podcasts number-one ranking for ethical AI; that ranking is the show\'s claim.'
  },
  { title: 'The Lying Liars podcast', text: 'Adult fiction and music podcast companion to the novel.' },
  { title: 'Instagram', href: 'https://instagram.com/barrylikethefruit', text: 'World-record nominated channel.' },
  { title: 'YouTube', href: 'https://youtube.com/@bfloore_online', text: 'Video channel.' },
  { title: 'TikTok', href: 'https://tiktok.com/@b_floore', text: 'Short-form channel.' },
  { title: 'Substack', href: 'https://barryfloore.substack.com', text: 'Writing and posts.' },
  { title: 'Medium', href: 'https://medium.com/@bfloore', text: 'Essays and posts.' },
  { title: 'Getty Images', text: 'Contributor with active monthly licensing.' },
  { title: 'Adobe Stock', text: 'Contributor; listed, with no paid licensing yet.' },
  { title: 'Serial Images', href: 'https://serialimages.vercel.app', text: 'App listed on the hub.' },
  { title: 'Etsy and Gumroad', text: 'Merch on Etsy and downloads on Gumroad, linked from the hub.' }
];

const projectLead = [
  { title: 'bfloore.online', href: 'https://www.bfloore.online', text: 'Personal hub (creative, professional modules, merch).' },
  { title: 'reviews.bfloore.online', href: 'https://reviews.bfloore.online', text: 'Affiliate review site (static build, publishing workflow).' },
  { title: 'Creative work', text: 'Musicals, fiction, visual media, and Friendly Robots children\'s books.' }
];

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
  },
  {
    id: 'health',
    label: 'Health / education',
    deck: 'Remix for health education, behavioral support, and research.'
  },
  {
    id: 'support',
    label: 'Remote support / crisis',
    deck: 'Remix for crisis intervention, live chat, and high-volume remote support.'
  },
  {
    id: 'creative',
    label: 'Content creation',
    deck: 'Remix for publishing, media, photography, and multi-platform content.'
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
      health: {
        paragraphs: [
          'Detail-oriented health educator, behavioral support specialist, and data evaluator with over a decade in public health, crisis navigation, peer education, digital learning, and mixed-methods research across healthcare, education, and AI domains. Skilled in trauma-informed facilitation, AOD risk reduction, student-centered wellness programming, and coding/pattern-analysis of qualitative data. Adept working across departments, managing peer staff, and supporting Title IX/Clery/VAWA compliance frameworks. Brings a research-grounded, data-driven approach to student safety, growth, and community-focused assessment.'
        ]
      },
      support: {
        paragraphs: [
          'Accomplished remote support professional with a track record in customer engagement, crisis intervention, and de-escalation, delivering support in high-stress, high-stakes environments. Former health educator and frontline critical-care provider; extensive experience leading and collaborating in interdisciplinary teams under pressure. Empathetic communication and grace under fire for immediate, appropriate support.'
        ]
      },
      creative: {
        paragraphs: [
          'Writer, composer, and independent producer building books, musicals, podcasts, and multi-platform content from Jacksonville, FL. Publishes the FRIENDLY ROBOTS! children\'s coloring, activity, and story series on Amazon, fiction including the Benny novella and The Lying Liars project, and three musicals in various stages of completion (SLOP!, Geoff & Maxie, spun). Produces podcasts Cultivating Ethical AI and The Lying Liars; maintains Instagram (world-record nominated), YouTube, and TikTok channels plus blogs; licenses photography through Getty Images (monthly licensing) and Adobe Stock.'
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
      education: {
        kicker: 'Education and healthcare lens',
        entries: [
          { title: 'Auditor | AI Model Trainer (SME)', org: 'Handshake AI', where: 'Remote', dates: '2025–Present' },
          {
            title: 'Auditor | AI Model Trainer', org: 'Mercor AI', where: 'Remote', dates: '2025–2026',
            bullets: ['Audit educational, tutoring, and conversational output for accuracy, safety, and guideline fit, including multimodal review.']
          },
          {
            title: 'Team Lead | Auditor', org: 'Appen / CrowdGen', where: 'Remote', dates: '2018–2024',
            bullets: ['Led evaluation across two dozen+ projects with a healthcare and education lens: UGC and AI output, annotation, collection, and QA for LLM training.']
          },
          {
            title: 'AI Model Trainer', org: 'Various contracts', where: 'Remote', dates: '2019–Present',
            bullets: ['Speech collection lead, healthcare SME/QA, annotation, transcription, and safety moderation across contract projects.']
          },
          {
            title: 'Standardized Test Scorer', org: 'Pearson Education', where: 'Remote', dates: '2022–Present',
            bullets: [
              'Trauma-informed scoring and rubric calibration on open-ended responses.',
              '50,000+ responses; 60+/hr at 90–95% inter-rater reliability.'
            ]
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
      crisis: {
        kicker: 'Crisis navigation and client service',
        entries: crisisServiceRoles
      },
      full: {
        kicker: 'Crisis, chat, reservations, donor services',
        entries: crisisServiceRoles.concat([
          { title: 'Seasonal support', org: 'Omaha Steaks; Ubisoft & Pole-to-Win', where: 'Remote', dates: 'Seasonal', bullets: ['Player support (Ubisoft & Pole-to-Win) and seasonal work for Omaha Steaks.'] }
        ])
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
          {
            title: 'Staff Critical Care RN | Incident Commander | Preceptor',
            org: 'Baptist Health Jacksonville',
            dates: '2011–2019',
            bullets: [
              'Level I Trauma and ICU care with high-acuity clinical decision-making.',
              'EMR trainer: onboarded clinicians on EPIC and Cerner.',
              'Led Code White disaster response as Incident Commander.',
              'Precepted new nursing staff; clinical education materials and competency assessments.'
            ]
          },
          {
            title: 'Travel RN',
            org: 'FlexCare',
            dates: '2018–2019',
            bullets: ['ED and ICU assignments, with education, community engagement, and new-hire orientation.']
          },
          {
            title: 'Healthcare SME & QA Analyst',
            org: 'Centific / Pactera Edge',
            dates: '2022–2023',
            bullets: [
              'Validated AI healthcare chatbot responses against clinical standards.',
              'Flagged hallucinated diagnoses, contraindicated treatments, and dangerous patient-facing misinformation.',
              'Applied MSN-level clinical judgment to edge cases beyond labeling guidelines.'
            ]
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
      practice: {
        entries: projectLead.concat([
          { title: 'Serial Images and other apps', text: 'Listed on the hub.' },
          { title: 'Ongoing publishing', text: 'Multi-platform content and ops.' },
          {
            title: 'FRIENDLY ROBOTS!',
            href: 'https://friendlyrobots.online',
            text: 'Children\'s coloring, activity, and story series, with published titles on Amazon and expansions on Gumroad.',
            links: [{ href: 'https://www.amazon.com/stores/B.-Floore/author/B0D2DBX9BH', label: 'Amazon author store' }]
          },
          { title: 'Musicals in progress', href: 'https://slopthemusical.com', text: 'Three musicals in various stages of completion: SLOP!, Geoff & Maxie, and spun.' },
          { title: 'Podcasts and stock photography', text: 'Cultivating Ethical AI and The Lying Liars. Getty Images contributor with monthly licensing. Adobe Stock contributor, with no paid licensing yet.' }
        ])
      },
      creative: {
        entries: projectLead.slice(0, 2).concat(creativePortfolio)
      },
      full: {
        entries: projectLead.concat([
          { title: 'Ongoing publishing', text: 'Multi-platform content and ops.' }
        ]).concat(creativePortfolio)
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
      operator: {
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
      },
      support: {
        items: [
          'Crisis intervention and de-escalation',
          'Trauma-informed communication',
          'High-pressure, high-volume support',
          'CRM and multi-platform systems',
          'Live chat and phone',
          'Sales conversion',
          'Night-shift reliability'
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
          'Remote reliability',
          'Crisis intervention and de-escalation',
          'Trauma-informed communication',
          'Night-shift reliability'
        ]
      }
    }
  },
  {
    id: 'skills-health',
    label: 'Health skills',
    title: 'Skills — health',
    kind: 'skills',
    variants: {
      full: {
        items: [
          'Trauma-informed facilitation and crisis navigation',
          'Health education and AOD risk reduction',
          'Peer staff management',
          'Title IX / Clery / VAWA compliance familiarity',
          'Qualitative / mixed-methods research and coding',
          'Rubric calibration and inter-rater reliability',
          'Stakeholder-facing insight reporting'
        ]
      }
    }
  },
  {
    id: 'skills-creative',
    label: 'Creative skills',
    title: 'Skills — creative',
    kind: 'skills',
    variants: {
      full: {
        items: [
          'Publishing and Amazon/KDP workflow',
          'Multi-platform content systems',
          'Podcast production',
          'Musical book, lyric, and composition',
          'Children\'s STEM/SEL content',
          'Stock photography and licensing',
          'Brand ownership across Instagram, YouTube, and TikTok',
          'Affiliate and merch ops'
        ]
      }
    }
  }
];

/* Which variant a remix shows when that module is visible.
   Turning a section on does not create a remix; it uses this map.
   The full CV view always uses `full`. */
const variantMap = {
  summary: { general: 'blend', ai: 'ai', freelance: 'freelance', health: 'health', support: 'support', creative: 'creative' },
  'exp-ai': { general: 'light', ai: 'full', freelance: 'supporting', health: 'education', support: 'light', creative: 'light' },
  'exp-cs': { general: 'full', ai: 'full', freelance: 'select', health: 'crisis', support: 'crisis', creative: 'select' },
  clinical: { general: 'full', ai: 'full', freelance: 'full', health: 'full', support: 'full', creative: 'full' },
  projects: { general: 'light', ai: 'light', freelance: 'practice', health: 'light', support: 'light', creative: 'creative' },
  education: { general: 'full', ai: 'full', freelance: 'full', health: 'full', support: 'full', creative: 'full' },
  'skills-ai': { general: 'core', ai: 'full', freelance: 'full', health: 'core', support: 'core', creative: 'core' },
  'skills-ops': { general: 'core', ai: 'full', freelance: 'operator', health: 'core', support: 'support', creative: 'operator' },
  'skills-health': { general: 'full', ai: 'full', freelance: 'full', health: 'full', support: 'full', creative: 'full' },
  'skills-creative': { general: 'full', ai: 'full', freelance: 'full', health: 'full', support: 'full', creative: 'full' }
};

/* General: blended summary, light AI experience, light projects,
   education, core skills. Customer service off. Clinical off.
   AI trainer: AI summary, full AI experience, light projects, AI skills,
   education. Customer service and clinical off. Operator skills off.
   Freelancer: freelance summary, practice-length projects, operator skills,
   selected client-ops roles, education, AI experience as support.
   Practice projects name the series, musicals, podcasts, and stock work
   without the channel-by-channel portfolio used by Content creation.
   Health / education: health summary, Pearson and Appen healthcare lens,
   crisis-focused customer service, enriched clinical background,
   education, health skills. Projects and operator skills off.
   Remote support / crisis: support summary, crisis-focused customer service,
   clinical background, education, support skills. AI experience off.
   Content creation: creative summary, portfolio projects, education,
   operator skills, creative skills. Customer service and clinical off. */
const presets = {
  general: ['summary', 'exp-ai', 'projects', 'education', 'skills-ai', 'skills-ops'],
  ai: ['summary', 'exp-ai', 'projects', 'education', 'skills-ai'],
  freelance: ['summary', 'exp-ai', 'exp-cs', 'projects', 'education', 'skills-ops'],
  health: ['summary', 'exp-ai', 'exp-cs', 'clinical', 'education', 'skills-health'],
  support: ['summary', 'exp-cs', 'clinical', 'education', 'skills-ops'],
  creative: ['summary', 'projects', 'education', 'skills-ops', 'skills-creative']
};

module.exports = {
  identity: identity,
  remixes: remixes,
  modules: modules,
  variantMap: variantMap,
  presets: presets,
  moduleIds: modules.map(function (m) { return m.id; })
};
