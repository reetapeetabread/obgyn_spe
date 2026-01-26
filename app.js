const STATE = { responses: {} };

/* -------------------- BUILDERS -------------------- */

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
    bullets: ["Insufficient contact or no observation", "Unable to evaluate fairly"]
  };
}

/* -------------------- UTILS -------------------- */

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

/* -------------------- SETTING QUESTION -------------------- */

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
/* -------------------- BRANCH QUESTIONS -------------------- */

const BRANCH_QUESTIONS = {
  INPATIENT: [
    rubricItem({
      id: "q1_information_gathering",
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
      id: "q2_clinical_reasoning",
      number: 2,
      required: true,
      prompt: "CLINICAL REASONING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Knowledge gaps limit recognition of key inpatient diagnoses",
          "Generates an incomplete, disorganized, or poorly supported differential",
          "Unable to articulate reasoning clearly during rounds"
        ]),
        level(2, "Progressing towards Expectations", [
          "Recognizes common causes but misses important nuances",
          "Creates a differential lacking adequate depth, structure, or prioritization",
          "Explains diagnostic reasoning inconsistently or without a clear approach"
        ]),
        level(3, "Meets Expectations", [
          "Demonstrates solid knowledge of common and moderately complex inpatient conditions",
          "Creates a well-structured, data-supported differential that is appropriately prioritized",
          "Explains diagnostic logic clearly, logically, and using relevant medical evidence"
        ]),
        level(4, "Exceeds Expectations", [
          "Applies comprehensive knowledge to generate strong medical insight",
          "Develops a complete, well-prioritized differential that fully integrates evolving clinical data",
          "Integrates evidence and pathophysiology to guide confident real-time decisions during the visit"
        ])
      ]
    }),
    rubricItem({
      id: "q3_management_treatment",
      number: 3,
      required: true,
      prompt: "MANAGEMENT AND TREATMENT PLANNING",
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
      id: "q4_presentations_documentation",
      number: 4,
      required: true,
      prompt: "ORAL PRESENTATIONS AND DOCUMENTATION",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Disorganized and difficult to follow presentations and/or documentation",
          "Includes missing data, factual inaccuracies, or irrelevant details",
          "Provides an assessment and plan that lack clear reasoning"
        ]),
        level(2, "Progressing towards Expectations", [
          "Generally organized but lacks a coherent flow in presentations and/or documentation",
          "Mostly accurate but contains minor omissions",
          "Presents an assessment or plan without sufficient clarity or justification"
        ]),
        level(3, "Meets Expectations", [
          "Organized, concise, and clinically focused presentations and/or documentation",
          "Accurately summarizes key data and active problems",
          "Communicates diagnostic reasoning and next steps clearly"
        ]),
        level(4, "Exceeds Expectations", [
          "Delivers highly polished, well-structured presentations and/or documentation",
          "Synthesizes essential information with precision",
          "Demonstrates advanced reasoning and incorporates shared decision-making effectively"
        ])
      ]
    })
  ],

  AMBULATORY: [
    rubricItem({
      id: "q1_information_gathering",
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
      id: "q2_clinical_reasoning",
      number: 2,
      required: true,
      prompt: "CLINICAL REASONING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Misses common outpatient conditions due to knowledge gaps",
          "Generates a narrow, poorly supported, or incompletely developed differential",
          "Fails to apply reasoning effectively to prevention or management decisions"
        ]),
        level(2, "Progressing towards Expectations", [
          "Recognizes common causes but misses important nuances",
          "Creates a differential lacking adequate depth, structure, or prioritization",
          "Explains diagnostic reasoning inconsistently or without a clear approach"
        ]),
        level(3, "Meets Expectations", [
          "Demonstrates solid knowledge of common and moderately complex outpatient conditions",
          "Creates a well-structured, contextually supported differential that is appropriately prioritized",
          "Explains diagnostic logic clearly, logically, and using relevant clinical evidence"
        ]),
        level(4, "Exceeds Expectations", [
          "Applies comprehensive knowledge to generate strong clinical insight",
          "Develops a complete, well-prioritized differential that incorporates evolving patient information",
          "Integrates evidence and pathophysiology to guide confident real-time decisions during the visit"
        ])
      ]
    }),
    rubricItem({
      id: "q3_management_followup",
      number: 3,
      required: true,
      prompt: "MANAGEMENT AND FOLLOW-UP PLANNING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Plan lacks structure or rationale for outpatient management",
          "Suggests unsafe or unrealistic interventions",
          "Requires excessive prompting and fails to identify appropriate follow-up steps"
        ]),
        level(2, "Progressing towards Expectations", [
          "Plan generally appropriate but incomplete for outpatient goals",
          "Provides partial reasoning and needs guidance on follow-up planning",
          "Selects reasonable tests or treatments only after prompting"
        ]),
        level(3, "Meets Expectations", [
          "Creates organized, evidence-based plans that address primary outpatient concerns",
          "Provides clear reasoning that prioritizes decisions for outpatient needs",
          "Chooses appropriate tests or treatments and executes routine follow-up tasks reliably"
        ]),
        level(4, "Exceeds Expectations", [
          "Anticipates long-term clinical needs and adjusts plans proactively",
          "Manages evolving outpatient needs with strong situational awareness",
          "Selects and justifies high-value tests or treatments that account for patient-specific outpatient factors"
        ])
      ]
    }),
    rubricItem({
      id: "q4_presentations_documentation",
      number: 4,
      required: true,
      prompt: "ORAL PRESENTATIONS AND DOCUMENTATION",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Disorganized and difficult to follow presentations and/or documentation",
          "Includes missing, inaccurate, or low-yield outpatient information",
          "Provides an assessment and plan that lack clear reasoning"
        ]),
        level(2, "Progressing towards Expectations", [
          "Generally organized but lacks a coherent flow in presentations and/or documentation",
          "Mostly accurate but contains minor omissions or incomplete outpatient details",
          "Offers an assessment or plan without sufficient clarity or justification"
        ]),
        level(3, "Meets Expectations", [
          "Organized, concise, and clinically focused presentations and/or documentation",
          "Summarizes key outpatient history, exam findings, and visit priorities accurately",
          "Communicates diagnostic reasoning and next steps clearly"
        ]),
        level(4, "Exceeds Expectations", [
          "Delivers highly polished, well-structured presentations and/or documentation",
          "Synthesizes essential outpatient information with precision",
          "Demonstrates advanced reasoning and incorporates shared decision-making effectively"
        ])
      ]
    })
  ],

  SURGERY: [
    rubricItem({
      id: "q1_preop_preparation",
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
      id: "q2_fund_of_knowledge",
      number: 2,
      required: true,
      prompt: "FUND OF KNOWLEDGE",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Limited understanding of anatomy, physiology, or foundational surgical principles",
          "Unable to connect surgical concepts to patient care or operative findings",
          "Shows minimal curiosity or effort to learn from cases"
        ]),
        level(2, "Progressing towards Expectations", [
          "Understands general surgical principles but misses key operative details or relationships",
          "Applies anatomical or procedural knowledge inconsistently or only with prompting",
          "Shows interest but limited initiative to expand understanding independently"
        ]),
        level(3, "Meets Expectations", [
          "Demonstrates solid knowledge of anatomy, pathology, and procedural rationale relevant to surgical care",
          "Applies anatomical and procedural concepts accurately during discussions or intraoperative teaching",
          "Asks thoughtful questions and shows consistent improvement"
        ]),
        level(4, "Exceeds Expectations", [
          "Applies comprehensive operative knowledge to generate strong surgical insight",
          "Integrates anatomy, pathology, and evolving case findings into a complete, well-prioritized understanding",
          "Integrates evidence and pathophysiology to understand real-time operative observations"
        ])
      ]
    }),
    rubricItem({
      id: "q3_perioperative_support",
      number: 3,
      required: true,
      prompt: "PERIOPERATIVE SUPPORT AND PATIENT CARE",
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
      id: "q4_intraop_technique",
      number: 4,
      required: true,
      prompt: "INTRAOPERATIVE SURGICAL TECHNIQUE",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Unprepared and unable to navigate expected OR workflow",
          "Handles instruments unsafely or without awareness of the operative field",
          "Requires frequent correction and shows minimal engagement with the team"
        ]),
        level(2, "Progressing towards Expectations", [
          "Generally safe but lacks a coherent, reliable approach to basic OR workflow",
          "Performs simple tasks only when prompted and remains mostly reactive",
          "Communicates inconsistently with the surgical team and needs reminders about participation"
        ]),
        level(3, "Meets Expectations", [
          "Organized, attentive, and clinically focused during intraoperative participation",
          "Participates safely and assists reliably with operative tasks",
          "Communicates clearly, follows instructions well, and remains attentive and professional throughout the case"
        ]),
        level(4, "Exceeds Expectations", [
          "Delivers highly polished, efficient, and well-coordinated intraoperative assistance",
          "Performs tasks smoothly and efficiently with minimal prompting and strong field awareness",
          "Supports coordinated teamwork through confident, timely communication and effectively anticipates next steps"
        ])
      ]
    })
  ]
};

const SHARED_QUESTIONS = [
  rubricItem({
    id: "q5_patient_family_communication",
    number: 5,
    required: true,
    prompt: "COMMUNICATION WITH PATIENTS AND FAMILIES",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Disorganized or unclear communication that misses or interrupts patient concerns",
        "Uses jargon or technical language without checking understanding",
        "Appears rushed, detached, or insensitive with patients or families"
      ]),
      level(2, "Progressing towards Expectations", [
        "Generally clear but lacks a consistent approach to fully addressing concerns",
        "Provides information politely but with limited clarity, structure, or confirmation of understanding",
        "Recognizes emotions or questions but responds superficially"
      ]),
      level(3, "Meets Expectations", [
        "Clear, organized, and respectful communication with patients and families",
        "Uses plain language, checks comprehension, and explains information accurately",
        "Shows consistent empathy and professionalism appropriate for level"
      ]),
      level(4, "Exceeds Expectations", [
        "Delivers polished, compassionate, patient-centered communication",
        "Explains complex issues clearly while anticipating questions or concerns",
        "Builds strong rapport, responds proactively to emotional needs, and models excellent communication for peers"
      ])
    ]
  }),
  rubricItem({
    id: "q6_team_communication",
    number: 6,
    required: true,
    prompt: "COMMUNICATION WITH INTERPROFESSIONAL TEAM",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Misses key updates, orders, or follow-up actions",
        "Communicates abruptly, unclearly, or without regard for team roles",
        "Shows unreliable follow-through or inconsistent handoffs"
      ]),
      level(2, "Progressing towards Expectations", [
        "Communicates when prompted but participates inconsistently",
        "Engages respectfully but remains largely passive with the team",
        "Needs reminders to coordinate tasks, clarify plans, or close communication loops"
      ]),
      level(3, "Meets Expectations", [
        "Communicates clearly, promptly, and professionally with all staff",
        "Collaborates well across disciplines and supports smooth workflow",
        "Provides timely updates and dependable handoffs that ensure shared understanding"
      ]),
      level(4, "Exceeds Expectations", [
        "Delivers polished, proactive, well-coordinated interprofessional communication",
        "Anticipates team needs, supports workflow, and communicates confidently across roles",
        "Builds strong, respectful relationships that enhance coordinated care and team efficiency"
      ])
    ]
  }),
  rubricItem({
    id: "q7_humanism",
    number: 7,
    required: true,
    prompt: "HUMANISM",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Disrespectful, impatient, or judgmental under stress",
        "Shows bias, dismisses concerns, or appears detached with patients",
        "Prioritizes personal convenience over patient needs and shows limited sensitivity"
      ]),
      level(2, "Progressing towards Expectations", [
        "Polite and courteous but with limited warmth or emotional awareness",
        "Recognizes distress but responds briefly or superficially",
        "Maintains professionalism but focuses more on tasks than patient experience"
      ]),
      level(3, "Meets Expectations", [
        "Consistently respectful, kind, and patient with individuals and families",
        "Shows empathy even under time pressure or stress",
        "Communicates inclusively, without judgment, and with appropriate emotional awareness"
      ]),
      level(4, "Exceeds Expectations", [
        "Demonstrates exceptional compassion, humility, and emotional insight",
        "Responds to distress with a calm, reassuring presence",
        "Models humanistic care that positively shapes team culture"
      ])
    ]
  }),
  rubricItem({
    id: "q8_integrity_work_ethic",
    number: 8,
    required: true,
    prompt: "INTEGRITY AND WORK ETHIC",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Frequently late, unprepared, or unreliable in availability",
        "Fails to complete tasks, orders, or follow-through and avoids accountability",
        "Shows limited initiative with lapses in professionalism"
      ]),
      level(2, "Progressing towards Expectations", [
        "Generally dependable with reminders and oversight",
        "Completes tasks but shows little initiative and acknowledges errors only when prompted",
        "Maintains basic professionalism but rarely takes independent ownership"
      ]),
      level(3, "Meets Expectations", [
        "Reliable, punctual, and consistently prepared for responsibilities",
        "Takes responsibility for errors and corrects issues independently",
        "Maintains confidentiality, professionalism, and steady follow-through"
      ]),
      level(4, "Exceeds Expectations", [
        "Demonstrates exceptional reliability, initiative, and accountability under stress",
        "Anticipates team needs and contributes proactively without prompting",
        "Models exemplary professionalism and ethical conduct for peers and staff"
      ])
    ]
  }),
  rubricItem({
    id: "q9_commitment_learning",
    number: 9,
    required: true,
    prompt: "COMMITMENT TO LEARNING",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Unprepared, disengaged, or defensive during teaching moments",
        "Does not apply new knowledge to patient care or learning tasks",
        "Responds poorly to feedback and shows minimal initiative"
      ]),
      level(2, "Progressing towards Expectations", [
        "Accepts feedback but applies it inconsistently",
        "Prepares superficially, only when prompted or with close supervision",
        "Engages variably in educational activities"
      ]),
      level(3, "Meets Expectations", [
        "Seeks feedback and uses it to improve performance",
        "Prepares independently and applies learning reliably to patient care",
        "Contributes meaningful teaching points and participates actively in discussions"
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
/* -------------------- RENDER -------------------- */

let root = null;

document.addEventListener("DOMContentLoaded", () => {
  root = document.getElementById("surveyRoot");
  if (!root) {
    console.error('Missing element: <div id="surveyRoot"></div>');
    return;
  }
  wireButtons();
  renderSurvey(buildSurvey(getSetting()), root);
});

function onSettingChange(newSettingKey) {
  STATE.responses[SETTING_QUESTION.id] = newSettingKey;
  renderSurvey(buildSurvey(newSettingKey), root);
}

function renderSurvey(survey, mount) {
  mount.innerHTML = "";

  // Optional wrapper class for layout
  mount.classList.add("surveyRoot");

  survey.sections.forEach((section) => {
    const sectionWrap = document.createElement("div");
    sectionWrap.className = "surveySection";

    const h = document.createElement("div");
    h.className = "sectionHeader";
    h.textContent = section.title;
    sectionWrap.appendChild(h);

    section.items.forEach((item) => {
      const card = document.createElement("section");
      card.className = "questionCard";
      card.dataset.qid = item.id;

      const top = document.createElement("div");
      top.className = "qTop";

      const isSetting = item.type === "setting";
      const displayNumber =
        !isSetting && typeof item.number === "number" ? item.number : null;

      const title = document.createElement("div");
      title.className = "qTitle";
      title.innerHTML =
        `${displayNumber ? `${displayNumber}. ` : ""}` +
        `${escapeHtml(item.prompt)}` +
        `${item.required ? `<span class="qReq">*</span>` : ""}`;

      const meta = document.createElement("div");
      meta.className = "qMeta";
      meta.textContent = section.title.toUpperCase();

      top.appendChild(title);
      top.appendChild(meta);
      card.appendChild(top);

      if (item.type === "setting") card.appendChild(renderSetting(item));
      else if (item.type === "rubric") card.appendChild(renderRubric(item));
      else if (item.type === "textarea") card.appendChild(renderTextarea(item));
      else {
        const p = document.createElement("div");
        p.textContent = "Unsupported item type: " + item.type;
        card.appendChild(p);
      }

      sectionWrap.appendChild(card);
    });

    mount.appendChild(sectionWrap);
  });
}

/* -------------------- ITEM RENDERERS -------------------- */

function renderSetting(item) {
  const wrap = document.createElement("div");
  wrap.className = "freeText";

  const row = document.createElement("div");
  row.className = "inlineChoices";

  item.options.forEach((opt) => {
    const label = document.createElement("label");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = item.id;
    input.value = opt.key;
    input.checked = STATE.responses[item.id] === opt.key;
    input.addEventListener("change", () => onSettingChange(opt.key));

    const span = document.createElement("span");
    span.textContent = opt.label;

    label.appendChild(input);
    label.appendChild(span);
    row.appendChild(label);
  });

  wrap.appendChild(row);
  return wrap;
}

function renderRubric(item) {
  const wrap = document.createElement("div");
  wrap.className = "levels";

  const name = item.id;
  const saved = STATE.responses[name] || "";

  item.levels.forEach((lvl) => {
    const box = document.createElement("div");
    box.className = "levelBox";

    const label = document.createElement("label");
    label.className = "levelLabel";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = lvl.key;
    input.checked = saved === String(lvl.key);
    input.addEventListener("change", () => (STATE.responses[name] = input.value));

    const text = document.createElement("div");
    text.className = "levelText";

    const head = document.createElement("div");
    head.className = "levelHeadline";
    head.textContent = lvl.headline;
    text.appendChild(head);

    if (Array.isArray(lvl.bullets) && lvl.bullets.length) {
      const ul = document.createElement("ul");
      ul.className = "bullets";
      lvl.bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        ul.appendChild(li);
      });
      text.appendChild(ul);
    }

    label.appendChild(input);
    label.appendChild(text);
    box.appendChild(label);
    wrap.appendChild(box);
  });

  return wrap;
}

function renderTextarea(item) {
  const wrap = document.createElement("div");
  wrap.className = "freeText";

  if (item.help) {
    const help = document.createElement("div");
    help.className = "fieldLabel";
    help.textContent = item.help;
    wrap.appendChild(help);
  }

  const ta = document.createElement("textarea");
  ta.name = item.id;
  ta.placeholder = item.placeholder || "Type here...";
  ta.value = STATE.responses[item.id] || "";
  ta.addEventListener("input", () => (STATE.responses[item.id] = ta.value));

  wrap.appendChild(ta);
  return wrap;
}

/* -------------------- COLLECT + EXPORT -------------------- */

function collectResponses(survey) {
  survey.sections.forEach((section) => {
    section.items.forEach((item) => {
      if (item.type === "rubric" || item.type === "setting") {
        const chosen = document.querySelector(
          `input[name="${cssEscape(item.id)}"]:checked`
        );
        if (chosen) STATE.responses[item.id] = chosen.value;
      } else if (item.type === "textarea") {
        const ta = document.querySelector(`textarea[name="${cssEscape(item.id)}"]`);
        if (ta) STATE.responses[item.id] = ta.value;
      }
    });
  });

  return {
    collectedAt: new Date().toISOString(),
    setting: STATE.responses[SETTING_QUESTION.id] || "",
    responses: { ...STATE.responses }
  };
}

function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

/* -------------------- BUTTONS -------------------- */

function wireButtons() {
  const btnPrint = document.getElementById("btnPrint");
  if (btnPrint) btnPrint.addEventListener("click", () => window.print());

  const btnSave = document.getElementById("btnSave");
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      const data = collectResponses(buildSurvey(getSetting()));
      downloadJson(data, "survey_responses.json");
    });
  }
}

