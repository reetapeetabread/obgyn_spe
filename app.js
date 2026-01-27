/* =========================
   GLOBAL STATE
   ========================= */

const STATE = {
  responses: {}
};

/* =========================
   BUILDERS
   ========================= */

function rubricItem({ id, number, required, prompt, levels }) {
  return { type: "rubric", id, number, required, prompt, levels };
}

function level(score, label, bullets) {
  return { key: String(score), headline: `(${score}) ${label}`, bullets };
}

function level0() {
  return {
    key: "0",
    headline: "(0) N/A",
    bullets: [
      "Insufficient contact or no observation",
      "Unable to evaluate fairly"
    ]
  };
}

/* =========================
   UTILS
   ========================= */

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cssEscape(s) {
  return String(s).replaceAll('"', '\\"');
}

/* =========================
   SETTING QUESTION (ALWAYS FIRST)
   ========================= */
const PLACEHOLDER_QUESTION = {
  type: "placeholder",
  id: "placeholder_intro",
  number: null, // unnumbered
  required: false,
  prompt: "The Liaison Committee on Medical Education (LCME), the national accrediting agency for medical schools, prohibits any individual from evaluating a medical student's performance if they are providing the student with any health services. The LCME guideline specifically states: The health professionals who provide health services, including psychiatric or psychological counseling, to a medical student have no involvement in the academic assessment or promotion of the medical student receiving those services. Please see the DGSOM Duality of Interest page for the full policy statement. If you are providing this student with any health services, you have a duality of interest and this evaluation will not be available for you to complete.",
   options: [
    { label: "I have a duality of interest and cannot evaluate this student." },
    { label: "I do not have a duality of interest and can evaluate this student." },
  ]
};

const SETTING_QUESTION = {
  type: "setting",
  id: "setting_context",
  number: null, // unnumbered
  required: true,
  prompt: "What setting did you work with this student in?",
  options: [
    { key: "INPATIENT", label: "Inpatient" },
    { key: "AMBULATORY", label: "Ambulatory" },
    { key: "SURGERY", label: "Surgery" }
  ]
};

/* =========================
   SURVEY BUILD
   ========================= */

function getSetting() {
  return STATE.responses[SETTING_QUESTION.id] || "";
}

function buildSurvey(settingKey) {
  // Before setting chosen → ONLY show setting question
  if (!settingKey) {
    return {
      sections: [
        {
          id: "setting",
          title: "Setting",
          items: [SETTING_QUESTION]
        }
      ]
    };
  }

  const branchItems = BRANCH_QUESTIONS[settingKey] || [];

  return {
    sections: [
      {
        id: "setting",
        title: "Setting",
        items: [SETTING_QUESTION]
      },
      {
        id: "evaluation",
        title: "Evaluation",
        items: [...branchItems, ...SHARED_QUESTIONS]
      },
      {
        id: "comments",
        title: "Comments",
        items: COMMENTS_BLOCK
      }
    ]
  };
}
/* =========================
   QUESTION BANKS
   (BRANCH_QUESTIONS, SHARED_QUESTIONS, COMMENTS_BLOCK)
   ========================= */

/* -------------------- BRANCH QUESTIONS -------------------- */

const BRANCH_QUESTIONS = {
  INPATIENT: [
    rubricItem({
      id: "inpatient_q1_information_gathering",
      number: 1,
      required: true,
      prompt: "INFORMATION GATHERING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Misses key inpatient priorities and safety-critical details",
          "Overlooks essential history or exam findings relevant to acute management",
          "Uses generic templates or irrelevant exam steps"
        ]),
        level(2, "Progressing towards Expectations", [
          "Obtains core story and basic exam but loses focus with complex or unstable patients",
          "Misses qualifiers, context, or maneuvers important for inpatient decisions",
          "Adjusts inconsistently and includes low-yield questions or steps"
        ]),
        level(3, "Meets Expectations", [
          "Organized, efficient history and exam aligned with inpatient priorities",
          "Provides accurate, relevant details that inform daily assessment",
          "Adapts well to changes in patient condition and comfort"
        ]),
        level(4, "Exceeds Expectations", [
          "Exceptionally efficient and focused information gathering for acute care",
          "Identifies subtle, high-impact findings that shift management",
          "Dynamically tailors questions and maneuvers with clear real-time analysis"
        ])
      ]
    }),
    rubricItem({
      id: "inpatient_q2_clinical_reasoning",
      number: 2,
      required: true,
      prompt: "CLINICAL REASONING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Knowledge gaps limit recognition of key inpatient diagnoses.",
          "Generates an incomplete, disorganized, or poorly supported differential.",
          "Unable to articulate reasoning clearly during rounds."
        ]),
        level(2, "Progressing towards Expectations", [
          "Recognizes common causes but misses important nuances.",
          "Creates a differential lacking adequate depth, structure, or prioritization.",
          "Explains diagnostic reasoning inconsistently or without a clear approach."
        ]),
        level(3, "Meets Expectations", [
          "Demonstrates solid knowledge of common and moderately complex inpatient conditions.",
          "Creates a well-structured, data-supported differential that is appropriately prioritized.",
          "Explains diagnostic logic clearly, logically, and using relevant medical evidence."
        ]),
        level(4, "Exceeds Expectations", [
          "Applies comprehensive knowledge to generate strong medical insight.",
          "Develops a complete, well-prioritized differential that fully integrates evolving clinical data.",
          "Integrates evidence and pathophysiology to guide confident real-time decisions during the visit."
        ])
      ]
    }),
    rubricItem({
      id: "inpatient_q3_management_treatment",
      number: 3,
      required: true,
      prompt: "MANAGEMENT and TREATMENT PLANNING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Produces plans lacking structure or rationale",
          "Suggests unsafe or unrealistic interventions",
          "Requires excessive prompting and fails to identify appropriate next steps"
        ]),
        level(2, "Progressing towards Expectations", [
          "Develops partially appropriate but incomplete plans",
          "Provides reasoning inconsistently and needs frequent guidance",
          "Selects reasonable tests or treatments only after prompting"
        ]),
        level(3, "Meets Expectations", [
          "Creates organized, evidence-based plans aligned with patient goals",
          "Provides clear rationale and defines appropriate follow-up steps",
          "Chooses appropriate tests or treatments and executes basic management tasks reliably"
        ]),
        level(4, "Exceeds Expectations", [
          "Designs comprehensive, anticipatory short and long-term management strategies",
          "Addresses barriers and promotes patient self-management proactively",
          "Selects and justifies high-value tests or treatments that account for individual patient factors"
        ])
      ]
    }),
    rubricItem({
      id: "inpatient_q4_presentations_documentation",
      number: 4,
      required: true,
      prompt: "ORAL PRESENTATIONS & DOCUMENTATION",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Disorganized and difficult to follow presentations and/or documentation.",
          "Includes missing data, factual inaccuracies, or irrelevant details.",
          "Provides an assessment and plan that lack clear reasoning."
        ]),
        level(2, "Progressing towards Expectations", [
          "Generally organized but lacks a coherent flow in presentations and/or documentation.",
          "Mostly accurate but contains minor omissions.",
          "Presents an assessment or plan without sufficient clarity or justification."
        ]),
        level(3, "Meets Expectations", [
          "Organized, concise, and clinically focused presentations and/or documentation.",
          "Accurately summarizes key data and active problems.",
          "Communicates diagnostic reasoning and next steps clearly."
        ]),
        level(4, "Exceeds Expectations", [
          "Delivers highly polished, well-structured presentations and/or documentation.",
          "Synthesizes essential information with precision.",
          "Demonstrates advanced reasoning and incorporates shared decision-making effectively."
        ])
      ]
    })
  ],

  AMBULATORY: [
    rubricItem({
      id: "ambulatory_q1_information_gathering",
      number: 1,
      required: true,
      prompt: "INFORMATION GATHERING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Misses key outpatient concerns or chronic-care priorities",
          "Overlooks essential elements of the medical history or physical exam",
          "Relies on generic templates without tailoring to the presenting issue"
        ]),
        level(2, "Progressing towards Expectations", [
          "Obtains the main story but loses focus with multiple concerns",
          "Misses qualifiers, context, or targeted exam maneuvers",
          "Adjusts inconsistently and includes low-yield questions"
        ]),
        level(3, "Meets Expectations", [
          "Organizes a focused, efficient history and physical aligned with visit goals",
          "Identifies accurate, relevant details informing diagnosis and follow-up",
          "Adapts smoothly to patient needs and time constraints"
        ]),
        level(4, "Exceeds Expectations", [
          "Prioritizes high-impact history and exam information with exceptional efficiency",
          "Identifies subtle details that refine diagnostic and long-term management",
          "Adjusts questions and exam dynamically with clear real-time reasoning"
        ])
      ]
    }),
    rubricItem({
      id: "ambulatory_q2_clinical_reasoning",
      number: 2,
      required: true,
      prompt: "CLINICAL REASONING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Misses common outpatient conditions due to knowledge gaps.",
          "Generates a narrow, poorly supported, or incompletely developed differential.",
          "Fails to apply reasoning effectively to prevention or management decisions."
        ]),
        level(2, "Progressing towards Expectations", [
          "Recognizes common causes but misses important nuances",
          "Creates a differential lacking adequate depth, structure, or prioritization.",
          "Explains diagnostic reasoning inconsistently or without a clear approach."
        ]),
        level(3, "Meets Expectations", [
          "Demonstrates solid knowledge of common and moderately complex outpatient conditions.",
          "Creates a well-structured, contextually supported differential that is appropriately prioritized.",
          "Explains diagnostic logic clearly, logically, and using relevant clinical evidence."
        ]),
        level(4, "Exceeds Expectations", [
          "Applies comprehensive knowledge to generate strong clinical insight.",
          "Develops a complete, well-prioritized differential that incorporates evolving patient information.",
          "Integrates evidence and pathophysiology to guide confident real-time decisions during the visit."
        ])
      ]
    }),
    rubricItem({
      id: "ambulatory_q3_management_followup",
      number: 3,
      required: true,
      prompt: "MANAGEMENT and FOLLOW-UP PLANNING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Plan lacks structure or rationale for outpatient management",
          "Suggests unsafe or unrealistic interventions",
          "Requires excessive prompting and fails to identify appropriate follow-up steps."
        ]),
        level(2, "Progressing towards Expectations", [
          "Plan generally appropriate but incomplete for outpatient goals",
          "Provides partial reasoning and needs guidance on follow-up planning",
          "Selects reasonable tests or treatments only after prompting."
        ]),
        level(3, "Meets Expectations", [
          "Creates organized, evidence-based plans that address primary outpatient concerns",
          "Provides clear reasoning that prioritizes decisions for outpatient needs",
          "Chooses appropriate tests or treatments and executes routine follow-up tasks reliably."
        ]),
        level(4, "Exceeds Expectations", [
          "Anticipates long-term clinical needs and adjusts plans proactively",
          "Manages evolving outpatient needs with strong situational awareness",
          "Selects and justifies high-value tests or treatments that account for patient-specific outpatient factors."
        ])
      ]
    }),
    rubricItem({
      id: "ambulatory_q4_presentations_documentation",
      number: 4,
      required: true,
      prompt: "ORAL PRESENTATIONS & DOCUMENTATION",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Disorganized and difficult to follow presentations and/or documentation.",
          "Includes missing, inaccurate, or low-yield outpatient information.",
          "Provides an assessment and plan that lack clear reasoning."
        ]),
        level(2, "Progressing towards Expectations", [
          "Generally organized but lacks a coherent flow in presentations and/or documentation.",
          "Mostly accurate but contains minor omissions or incomplete outpatient details.",
          "Offers an assessment or plan without sufficient clarity or justification."
        ]),
        level(3, "Meets Expectations", [
          "Organized, concise, and clinically focused presentations and/or documentation.",
          "Summarizes key outpatient history, exam findings, and visit priorities accurately.",
          "Communicates diagnostic reasoning and next steps clearly."
        ]),
        level(4, "Exceeds Expectations", [
          "Delivers highly polished, well-structured presentations and/or documentation.",
          "Synthesizes essential outpatient information with precision.",
          "Demonstrates advanced reasoning and incorporates shared decision-making effectively."
        ])
      ]
    })
  ],

  SURGERY: [
    rubricItem({
      id: "surgery_q1_preop_preparation",
      number: 1,
      required: true,
      prompt: "PRE-OPERATIVE CASE PREPARATION",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Unfamiliar with the patient, indication, anatomy, or operative plan",
          "Misses key chart, consent, or imaging details relevant to the procedure",
          "Shows minimal initiative and requires frequent prompting to prepare"
        ]),
        level(2, "Progressing towards Expectations", [
          "Understands the general indication but lacks depth or key details",
          "Reviews the chart or imaging inconsistently or incompletely",
          "Prepares reactively and anticipates next steps only when directed"
        ]),
        level(3, "Meets Expectations", [
          "Reviews chart, labs, notes, and imaging thoroughly before cases",
          "Summarizes indication, anatomy, and relevant findings clearly and succinctly",
          "Identifies information pertinent to the operation and anticipates basic operative flow"
        ]),
        level(4, "Exceeds Expectations", [
          "Integrates patient data accurately and concisely into pre-operative planning",
          "Demonstrates strong understanding of indication, anatomy, and procedural relevance",
          "Prioritizes safety-critical details and anticipates team needs and operative flow independently"
        ])
      ]
    }),
    rubricItem({
      id: "surgery_q2_fund_of_knowledge",
      number: 2,
      required: true,
      prompt: "FUND OF KNOWLEDGE",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Limited understanding of anatomy, physiology, or foundational surgical principles.",
          "Unable to connect surgical concepts to patient care or operative findings.",
          "Shows minimal curiosity or effort to learn from cases."
        ]),
        level(2, "Progressing towards Expectations", [
          "Understands general surgical principles but misses key operative details or relationships.",
          "Applies anatomical or procedural knowledge inconsistently or only with prompting.",
          "Shows interest but limited initiative to expand understanding independently."
        ]),
        level(3, "Meets Expectations", [
          "Demonstrates solid knowledge of anatomy, pathology, and procedural rationale relevant to surgical care.",
          "Applies anatomical and procedural concepts accurately during discussions or intraoperative teaching.",
          "Asks thoughtful questions and shows consistent improvement."
        ]),
        level(4, "Exceeds Expectations", [
          "Applies comprehensive operative knowledge to generate strong surgical insight.",
          "Integrates anatomy, pathology, and evolving case findings into a complete, well-prioritized understanding.",
          "Integrates evidence and pathophysiology to understand real-time operative observations."
        ])
      ]
    }),
    rubricItem({
      id: "surgery_q3_perioperative_support",
      number: 3,
      required: true,
      prompt: "PERIOPERATIVE SUPPORT and PATIENT CARE",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Does not recognize perioperative workflow or patient needs",
          "Shows limited effort to assist or observe patient transitions",
          "Requires frequent prompting and appears disengaged from safety or comfort considerations"
        ]),
        level(2, "Progressing towards Expectations", [
          "Understands basic perioperative flow but needs direction to remain involved",
          "Assists with tasks only when prompted",
          "Shows inconsistent awareness of patient experience and safety"
        ]),
        level(3, "Meets Expectations", [
          "Participates reliably in perioperative workflow when appropriate",
          "Assists with positioning, preparation, and PACU transition under supervision",
          "Communicates clearly and maintains awareness of patient comfort and safety"
        ]),
        level(4, "Exceeds Expectations", [
          "Demonstrates strong awareness of perioperative needs and workflow",
          "Anticipates tasks and assists proactively during transitions",
          "Supports patient comfort and safety with steady initiative and professionalism"
        ])
      ]
    }),
    rubricItem({
      id: "surgery_q4_intraoperative_technique",
      number: 4,
      required: true,
      prompt: "INTRAOPERATIVE SURGICAL TECHNIQUE",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Unprepared and unable to navigate expected OR workflow.",
          "Handles instruments unsafely or without awareness of the operative field.",
          "Requires frequent correction and shows minimal engagement with the team."
        ]),
        level(2, "Progressing towards Expectations", [
          "Generally safe but lacks a coherent, reliable approach to basic OR workflow.",
          "Performs simple tasks only when prompted and remains mostly reactive.",
          "Communicates inconsistently with the surgical team and needs reminders about participation."
        ]),
        level(3, "Meets Expectations", [
          "Organized, attentive, and clinically focused during intraoperative participation.",
          "Participates safely and assists reliably with operative tasks.",
          "Communicates clearly, follows instructions well, and remains attentive and professional throughout the case."
        ]),
        level(4, "Exceeds Expectations", [
          "Delivers highly polished, efficient, and well-coordinated intraoperative assistance.",
          "Performs tasks smoothly and efficiently with minimal prompting and strong field awareness.",
          "Supports coordinated teamwork through confident, timely communication and effectively anticipates next steps."
        ])
      ]
    })
  ]
};

/* -------------------- SHARED QUESTIONS (Q5-Q10) -------------------- */

const SHARED_QUESTIONS = [
  rubricItem({
    id: "q5_professionalism",
    number: 5,
    required: true,
    prompt: "PROFESSIONALISM",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Frequently late, unreliable, or unprepared without communication",
        "Demonstrates rudeness, dismissiveness, or insensitivity toward patients or team members",
        "Resists feedback or shows minimal insight into personal performance or growth areas"
      ]),
      level(2, "Progressing towards Expectations", [
        "Generally punctual but occasionally inconsistent or reactive",
        "Polite and respectful most of the time, but needs reminders about empathy or boundaries",
        "Receives feedback with variable openness and sometimes struggles to apply it"
      ]),
      level(3, "Meets Expectations", [
        "Reliable, punctual, and well-prepared for clinical duties",
        "Treats all individuals with respect, compassion, and cultural sensitivity",
        "Welcomes feedback and applies it to improve performance and clinical care"
      ]),
      level(4, "Exceeds Expectations", [
        "Models exemplary professionalism through consistency, initiative, and accountability",
        "Actively supports an inclusive, respectful environment for all",
        "Seeks feedback proactively, reflects deeply, and supports peers in professional growth"
      ])
    ]
  }),
  rubricItem({
    id: "q6_communication_empathy",
    number: 6,
    required: true,
    prompt: "COMMUNICATION and EMPATHY",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Uses jargon or overly complex language that confuses patients",
        "Fails to check understanding or address patient concerns",
        "Appears rushed, dismissive, or inattentive to emotional or social needs"
      ]),
      level(2, "Progressing towards Expectations", [
        "Communicates clearly but inconsistently adjusts to patient understanding or concerns",
        "Shows empathy at times but misses cues or appears task-focused",
        "Engages adequately but could improve rapport, trust, or shared decision-making"
      ]),
      level(3, "Meets Expectations", [
        "Communicates clearly and compassionately using patient-friendly language",
        "Actively listens, confirms understanding, and addresses concerns thoughtfully",
        "Builds trust and rapport while respecting patient autonomy and preferences"
      ]),
      level(4, "Exceeds Expectations", [
        "Communicates with exceptional clarity, sensitivity, and cultural awareness",
        "Anticipates patient needs, validates emotions, and navigates difficult conversations skillfully",
        "Builds strong therapeutic relationships and empowers patients in shared decision-making"
      ])
    ]
  }),
  rubricItem({
    id: "q7_advocacy",
    number: 7,
    required: true,
    prompt: "ADVOCACY",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Overlooks or dismisses social barriers affecting patient care",
        "Fails to recognize inequities or speak up for patient needs",
        "Shows limited awareness of broader systems or policies impacting care delivery"
      ]),
      level(2, "Progressing towards Expectations", [
        "Identifies basic social or structural barriers but often needs prompting to act",
        "Recognizes patient needs but inconsistently follows through or engages resources",
        "Shows emerging awareness of equity but lacks consistent application"
      ]),
      level(3, "Meets Expectations", [
        "Identifies social, financial, or structural barriers and addresses them proactively",
        "Advocates for individual patient needs and connects them with appropriate resources",
        "Demonstrates awareness of health equity and systemic factors shaping care"
      ]),
      level(4, "Exceeds Expectations", [
        "Champions patient needs effectively, navigating complex systems to ensure equitable care",
        "Actively challenges inequities and works to improve care delivery for vulnerable populations",
        "Demonstrates sophisticated understanding of social determinants and systemic advocacy"
      ])
    ]
  }),
  rubricItem({
    id: "q8_teamwork",
    number: 8,
    required: true,
    prompt: "TEAMWORK",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Works in isolation or fails to communicate with team members effectively",
        "Dismisses or ignores input from others, including nurses, residents, or attendings",
        "Contributes minimally to shared responsibilities or workflow"
      ]),
      level(2, "Progressing towards Expectations", [
        "Collaborates when prompted but inconsistently initiates communication or coordination",
        "Receptive to input at times but can be defensive or slow to integrate feedback",
        "Participates in team tasks but often needs redirection or reminders"
      ]),
      level(3, "Meets Expectations", [
        "Communicates proactively and collaborates smoothly with the interprofessional team",
        "Values and integrates input from all team members respectfully and constructively",
        "Contributes reliably to shared tasks and supports team goals and efficiency"
      ]),
      level(4, "Exceeds Expectations", [
        "Facilitates team coordination and strengthens collaboration through clear, timely communication",
        "Actively seeks and integrates diverse perspectives to enhance care and decision-making",
        "Models team leadership, supports others, and promotes a positive, inclusive team culture"
      ])
    ]
  }),
  rubricItem({
    id: "q9_self_directed_learning",
    number: 9,
    required: true,
    prompt: "SELF-DIRECTED LEARNING",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Waits passively for teaching or direction and rarely seeks additional learning",
        "Struggles to identify knowledge gaps or fails to address them independently",
        "Does not use cases, feedback, or resources to drive personal growth"
      ]),
      level(2, "Progressing towards Expectations", [
        "Identifies learning needs inconsistently and pursues growth mainly when prompted",
        "Uses resources or evidence sporadically and does not always integrate learning into practice",
        "Shows some interest in teaching but rarely initiates or contributes meaningfully"
      ]),
      level(3, "Meets Expectations", [
        "Identifies personal learning needs and seeks resources proactively to fill gaps",
        "Uses evidence-based information to inform care and applies learning to future cases",
        "Shares knowledge appropriately with peers and contributes to the team's learning environment"
      ]),
      level(4, "Exceeds Expectations", [
        "Identifies learning needs proactively and pursues growth independently",
        "Integrates new knowledge quickly and uses evidence to guide care or decisions",
        "Provides thoughtful, case-based teaching and supports peer learning when appropriate"
      ])
    ]
  }),
  rubricItem({
    id: "q10_coordination_of_care",
    number: 10,
    required: true,
    prompt: "COORDINATION OF CARE",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Unaware of core coordination steps for safe transitions",
        "Fails to loop in needed team members or resources",
        "Misses access, cost, or follow-up barriers that affect care"
      ]),
      level(2, "Progressing towards Expectations", [
        "Recognizes system gaps only after delays occur",
        "Communicates with teams or services mainly when prompted",
        "Coordinates reactively and rarely closes loops reliably"
      ]),
      level(3, "Meets Expectations", [
        "Initiates coordination early with clear, consistent communication",
        "Collaborates smoothly with nursing, case management, pharmacy, and specialties",
        "Accounts for access, coverage, scheduling, and follow-up to ensure continuity"
      ]),
      level(4, "Exceeds Expectations", [
        "Leads proactive, well-structured coordination for complex care plans",
        "Anticipates and resolves system barriers before they affect safety",
        "Advocates for efficient, equitable care with strong systems awareness"
      ])
    ]
  })
];

const COMMENTS_BLOCK = [
  {
    type: "textarea",
    id: "mspe_placeholder",
    number: 11,
    required: false,
    prompt: "Comments",
    help:
      "Additional comments on performance (may be included in the MSPE). " +
      "This text box is a placeholder to represent the format of the official MSPE narrative. " +
      "No information entered here is collected or stored.",
    placeholder:
      "This space intentionally mirrors the narrative comment section of the MSPE. " +
      "In the official evaluation, faculty comments would appear here in paragraph form."
  }
];

/* =========================
   RENDER PIPELINE
   ========================= */

let root = null;

document.addEventListener("DOMContentLoaded", () => {
  root = document.getElementById("surveyRoot");
  if (!root) {
    console.error('Missing <div id="surveyRoot"></div>');
    return;
  }

  renderSurvey(buildSurvey(getSetting()), root);
});

function onSettingChange(newSetting) {
  STATE.responses[SETTING_QUESTION.id] = newSetting;
  renderSurvey(buildSurvey(newSetting), root);
}

function renderSurvey(survey, mount) {
  mount.innerHTML = "";

  survey.sections.forEach((section) => {
    const sectionWrap = document.createElement("div");
    sectionWrap.className = "surveySection";

    const header = document.createElement("div");
    header.className = "sectionHeader";
    header.textContent = section.title;
    sectionWrap.appendChild(header);

    section.items.forEach((item) => {
      const card = document.createElement("section");
      card.className = "questionCard";

      const top = document.createElement("div");
      top.className = "qTop";

      const isSetting = item.type === "setting";
      const displayNumber =
        !isSetting && typeof item.number === "number"
          ? item.number
          : null;

      const title = document.createElement("div");
      title.className = "qTitle";
      title.innerHTML =
        `${displayNumber ? displayNumber + ". " : ""}` +
        `${escapeHtml(item.prompt)}` +
        `${item.required ? '<span class="qReq">*</span>' : ""}`;

      const meta = document.createElement("div");
      meta.className = "qMeta";
      meta.textContent = section.title.toUpperCase();

      top.appendChild(title);
      top.appendChild(meta);
      card.appendChild(top);

      if (item.type === "setting") {
        card.appendChild(renderSetting(item));
      } else if (item.type === "rubric") {
        card.appendChild(renderRubric(item));
      } else if (item.type === "textarea") {
        card.appendChild(renderTextarea(item));
      }

      sectionWrap.appendChild(card);
    });

    mount.appendChild(sectionWrap);
  });
}

/* =========================
   RENDER FUNCTIONS
   ========================= */

function renderSetting(item) {
  const container = document.createElement("div");
  container.className = "inlineChoices";

  item.options.forEach((opt) => {
    const label = document.createElement("label");
    
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = item.id;
    radio.value = opt.key;
    radio.checked = STATE.responses[item.id] === opt.key;
    
    radio.addEventListener("change", () => {
      onSettingChange(opt.key);
    });

    const span = document.createElement("span");
    span.textContent = opt.label;

    label.appendChild(radio);
    label.appendChild(span);
    container.appendChild(label);
  });

  return container;
}

function renderRubric(item) {
  const container = document.createElement("div");
  container.className = "levels";

  item.levels.forEach((lvl) => {
    const box = document.createElement("div");
    box.className = "levelBox";

    const label = document.createElement("label");
    label.className = "levelLabel";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = item.id;
    radio.value = lvl.key;
    radio.checked = STATE.responses[item.id] === lvl.key;
    
    radio.addEventListener("change", () => {
      STATE.responses[item.id] = lvl.key;
    });

    const textDiv = document.createElement("div");
    textDiv.className = "levelText";

    const headline = document.createElement("div");
    headline.className = "levelHeadline";
    headline.textContent = lvl.headline;

    textDiv.appendChild(headline);

    if (lvl.bullets && lvl.bullets.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "bullets";
      
      lvl.bullets.forEach((bullet) => {
        const li = document.createElement("li");
        li.textContent = bullet;
        ul.appendChild(li);
      });
      
      textDiv.appendChild(ul);
    }

    label.appendChild(radio);
    label.appendChild(textDiv);
    box.appendChild(label);
    container.appendChild(box);
  });

  return container;
}

function renderTextarea(item) {
  const container = document.createElement("div");
  container.className = "freeText";

  if (item.help) {
    const helpDiv = document.createElement("div");
    helpDiv.className = "fieldLabel";
    helpDiv.textContent = item.help;
    container.appendChild(helpDiv);
  }

  const textarea = document.createElement("textarea");
  textarea.name = item.id;
  textarea.placeholder = item.placeholder || "";
  textarea.value = STATE.responses[item.id] || "";
  
  textarea.addEventListener("input", (e) => {
    STATE.responses[item.id] = e.target.value;
  });

  container.appendChild(textarea);
  return container;
}
