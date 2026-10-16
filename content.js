/* 2026_098 — "How the invasion escalated"
   All editorial content lives here; app.js only renders it.

   Provenance rule for this file: every string is either (a) copied from Timeline.docx,
   (b) a translation of Portuguese text visible on screen in ASSET_3 / ASSET_5, or
   (c) a description of what is visible in the frame. Nothing comes from outside the
   session. Items marked NEEDS CHECK in README.md are flagged there, not here.

   One stop = one card in the carousel. Two stops share a date where the docx has two
   beats on the same day; the rail prints the date once and ticks twice. */

window.CONTENT = {

  title: "How the invasion escalated",

  deck: "Between Aug. 16 and Sept. 3, 2026, one campsite in the Ituna/Itatá Indigenous Territory became an occupation of more than 500 people – and local politicians posted about it as it happened.",

  stops: [
    {
      date: "Aug. 16",
      year: "2026",
      heading: "Funai finds a campsite inside the territory",
      blocks: [
        {
          type: "text",
          html: "By Aug. 16, 2026, Funai, the federal agency for Indigenous affairs, had reported a campsite inside the Ituna/Itatá Indigenous Territory, and estimated there were around <strong>100 people clearing new areas</strong>. Another group of roughly 100 people were moving deeper into the territory to clear roads and demarcate plots, according to an official letter by the Public Defender’s Office seen by Mongabay."
        },
        {
          type: "image",
          src: "assets/photo-1.jpg",
          width: 984,
          height: 504,
          alt: "A shelter roofed with a white tarpaulin and palm fronds stands in a clearing cut into dense forest, with a motorbike parked beneath it.",
          caption: "A tarpaulin-and-palm shelter, with a motorbike parked under it, in a clearing cut into the forest."
        }
      ]
    },

    {
      date: "Aug. 16",
      year: "2026",
      heading: "“A real threat to the lives” of Funai staff",
      blocks: [
        {
          type: "text",
          html: "The Public Defender’s Office said the incursion had evolved from the opening of access routes into an <strong>established occupation</strong>, warning of “concrete and current risk of confrontation” “with a real threat to the lives” of Funai staff and the isolated Indigenous people."
        }
      ]
    },

    {
      date: "Aug. 21",
      year: "2026",
      heading: "The mayor declares a “Promised Land”",
      blocks: [
        {
          type: "text",
          html: "On Aug. 21, Leonaldo Albuquerque, <strong>mayor of Senador José Porfírio</strong> municipality in Pará, posted images of a large crowd gathered around a barbecue and fireworks inside Ituna/Itatá, calling it the beginning of a new chapter."
        },
        {
          type: "quote",
          html: "Ituna‑Itatá is in the past. Now this is the Promised Land",
          attribution: "he wrote."
        },
      ]
    },

    {
      date: "Aug. 21",
      year: "2026",
      heading: "On video: plans for cattle ranchers",
      blocks: [
        {
          type: "text",
          html: "In the video, local politicians and newcomers stand at the edge of the federally protected Ituna/Itatá, speaking of plans to establish cattle ranches and other agricultural activities."
        },
        {
          type: "video",
          src: "assets/video-3.mp4",
          poster: "assets/video-3-poster.jpg",
          width: 480,
          height: 1040,
          alt: "Screen recording of an Instagram post showing a crowd walking along a dirt track, fireworks over the forest canopy, and men speaking to the camera.",
          /* On-screen Portuguese, in the order the cards appear, with the English given. */
          overlays: [
            { pt: "Um sonho que se transformou em realidade!", en: "A dream that became reality!" },
            { pt: "Liberação da área do antigo Ituna-Itatá", en: "Release of the area of the former Ituna-Itatá" },
            { pt: "Agora é Terra Prometida!", en: "Now it’s the Promised Land!" }
          ]
        }
      ]
    },

    {
      date: "Aug. 24",
      year: "2026",
      heading: "A state deputy turns up at the meeting",
      blocks: [
        {
          type: "text",
          html: "On Aug. 24, Torres posted an Instagram story from inside the territory."
        },
        {
          type: "quote",
          html: "I’m here at Gleba Bacajaí/Ituna/Itatá for a meeting with many rural producers who are welcoming me.",
          attribution: "he said."
        },
        {
          type: "text",
          html: "His appearance appeared to <strong>lend political legitimacy</strong> to the occupation. In the following week, satellites run by Brazil’s space agency started detecting fires inside the reserve."
        },
        {
          type: "video",
          src: "assets/video-4.mp4",
          poster: "assets/video-4-poster.jpg",
          width: 480,
          height: 1040,
          alt: "Screen recording of an Instagram story showing two men talking beside a motorbike in front of a red building, one of them giving a thumbs up.",
          overlays: [
            { pt: "Deputado Estadual Torrinho Torres 10.234", en: "State deputy Torrinho Torres 10.234" }
          ]
        }
      ]
    },

    {
      date: "Sept. 3",
      year: "2026",
      heading: "A joint operation dismantles the camp",
      blocks: [
        {
          type: "stat",
          value: "500+",
          label: "people had entered Ituna/Itatá by Aug. 24"
        },
        {
          type: "text",
          html: "A joint operation by Funai, IBAMA (the federal environmental protection agency) and the Federal Police on Sept. 3 found illegal occupants, motorcycles, and a camp, a spokesperson at the Ministry of Indigenous Affairs confirmed via email. The ministry said the authorities <strong>dismantled the camp</strong>, ordered its occupants to leave, and opened a police investigation into potential crimes. It declined to disclose further operational details, citing the need to protect the ongoing investigation."
        },
        {
          type: "image",
          src: "assets/photo-2.jpg",
          width: 1200,
          height: 900,
          alt: "Six agents in tactical vests stand with their backs to the camera, watching a tarpaulin-covered camp burn in a forest clearing.",
          caption: "Agents in vests marked IBAMA, Funai and Polícia Federal watch a tarpaulin-covered camp burn."
        }
      ]
    },

    {
      date: "Sept. 3",
      year: "2026",
      heading: "A state government tricycle at the scene",
      blocks: [
        {
          type: "text",
          html: "A state government cargo tricycle found at the scene raised questions about the extent of <strong>local authorities’ links to the invaders</strong>. According to the Public Prosecutor’s Office, the vehicle was the property of the State Secretariat for Cities and Regional Integration. A spokesperson for the secretariat said they were investigating it internally, but didn’t explain why taxpayer-funded property was found inside an illegal campsite on Indigenous land."
        },
        {
          type: "image",
          src: "assets/photo-5.jpg",
          width: 1200,
          height: 900,
          alt: "A white three-wheeled cargo motorbike parked on a dirt track, with people carrying bundles in the background.",
          caption: "The cargo tricycle. Its door panel reads “Aquisição de máquinas e equipamentos agrícolas” — purchase of agricultural machinery and equipment — under a government agreement number."
        }
      ]
    }
  ],

  source: "Sources: Funai; Public Defender’s Office; Ministry of Indigenous Affairs (MPI); Public Prosecutor’s Office; Instagram posts by @leonaldoalbuquerque_ and @torrinhotorres.",

  /* Interface strings, kept here so they can be translated with the rest. */
  ui: {
    play: "Play video",
    pause: "Pause video",
    soundOn: "Turn sound on",    /* button's accessible label while muted */
    soundOff: "Turn sound off",  /* button's accessible label while audible */
    soundIsOff: "Sound off",     /* visible label while muted */
    soundIsOn: "Sound on",       /* visible label while audible */
    onScreen: "On screen, translated",
    prev: "Previous",
    next: "Next",
    stepOf: "Step {i} of {n}",
    jumpTo: "Go to {date}: {heading}"
  }
};
