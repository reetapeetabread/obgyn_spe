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

const SETTING_QUESTION = {
  type: "setting",
  id: "setting_context",
  number: null,
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
   ========================= */

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
    })
  ],
  AMBULATORY: [
    rubricItem({
      id: "q1_information_gathering_amb",
      number: 1,
      required: true,
      prompt: "INFORMATION GATHERING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Misses key ambulatory priorities",
          "Overlooks essential preventive or chronic care elements",
          "Uses generic templates"
        ]),
        level(2, "Progressing towards Expectations", [
          "Obtains core story but misses important context",
          "Adjusts inconsistently to patient needs",
          "Includes some low-yield questions"
        ]),
        level(3, "Meets Expectations", [
          "Organized, efficient history and exam",
          "Provides accurate, relevant details",
          "Adapts well to patient needs"
        ]),
        level(4, "Exceeds Expectations", [
          "Exceptionally efficient information gathering",
          "Identifies subtle findings",
          "Dynamically tailors approach"
        ])
      ]
    })
  ],
  SURGERY: [
    rubricItem({
      id: "q1_information_gathering_surg",
      number: 1,
      required: true,
      prompt: "INFORMATION GATHERING",
      levels: [
        level0(),
        level(1, "Needs Improvement", [
          "Misses key surgical priorities",
          "Overlooks essential perioperative details",
          "Uses generic templates"
        ]),
        level(2, "Progressing towards Expectations", [
          "Obtains core story but misses important context",
          "Adjusts inconsistently",
          "Includes some low-yield steps"
        ]),
        level(3, "Meets Expectations", [
          "Organized, efficient surgical assessment",
          "Provides accurate, relevant details",
          "Adapts well to surgical context"
        ]),
        level(4, "Exceeds Expectations", [
          "Exceptionally efficient surgical assessment",
          "Identifies subtle findings",
          "Dynamically tailors approach"
        ])
      ]
    })
  ]
};

const SHARED_QUESTIONS = [
  rubricItem({
    id: "q6_interprofessional",
    number: 6,
    required: true,
    prompt: "INTERPROFESSIONAL COMMUNICATION",
    levels: [
      level0(),
      level(1, "Needs Improvement", [
        "Frequently uncommunicative or unclear with team members",
        "Creates confusion with delayed, incomplete, or inaccurate handoffs",
        "Fails to respond promptly or professionally to staff inquiries"
      ]),
      level(2, "Progressing towards Expectations", [
        "Communicates respectfully but with limited clarity or timeliness",
        "Handoffs are functional but lack important context or detail",
        "Requires prompting to follow up or coordinate across roles"
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
          ? item.number + 1
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
