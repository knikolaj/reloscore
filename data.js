/* ============================================================================
 * reloscore — data
 * ----------------------------------------------------------------------------
 * This is the file to edit. The engine (index.html) never needs touching.
 *
 * Everything here is a plain global, read by index.html. You can also do all of
 * this in the browser (add cities, change weights/scores) and use Export/Import
 * instead of editing this file — your edits are auto-saved in the browser.
 *
 * Scoring model:   score = Σ (weight × rating/5), normalized to 100
 *   - weight: 0-10, "how much this criterion matters to me"
 *   - rating: 1-5 per city per criterion (or Yes/No for binary criteria)
 *   - minPass: optional hard threshold. If a city rates below it on that
 *     criterion, the city is EXCLUDED entirely (non-compensable).
 * ========================================================================== */

/* ---- Hard gates (optional) --------------------------------------------------
 * A gate excludes a candidate outright, regardless of score. Leave empty for
 * none. Each city can then carry g[gateId] = "pass" | "fail".
 * Example: { id:"visa", name:"Visa realistically obtainable",
 *            rub:"Fail — no viable route for my passport → excluded." }
 */
const GATES = [];

/* ---- Criteria, grouped into blocks ------------------------------------------
 * Each criterion:
 *   id      unique key (also used in the city score arrays below)
 *   name    label shown in the table
 *   lvl     "city" | "country" | "city + country" (what the rating describes)
 *   wt      default weight 0-10
 *   note    optional parenthetical shown in the rubric popup
 *   minPass optional hard threshold (see above)
 *   binary  true → Yes/No instead of 1-5
 *   r       rubric: [what a 5 looks like, a 3, a 1]  (binary: [Yes, "", No])
 */
const BLOCKS = [
  { title:"Infrastructure & daily life", crits:[
    { id:"health", name:"Healthcare", lvl:"city + country", wt:10, r:["fast appointments, private clinics via insurance, English-speaking doctors","acceptable with compromises (queues/paid, so-so English)","6-month wait, specialist only 'if you're dying', no English"] },
    { id:"buro", name:"Bureaucracy", lvl:"country", wt:5, r:["fast, sensible, in English, not over-regulated","tolerable, some red tape","slow/unpredictable / everything strictly by the book"] },
    { id:"safety", name:"Safety", lvl:"city", wt:3, r:["very safe day and night","generally OK, some areas/nuances","high crime / unsafe"] },
    { id:"rent", name:"Rental housing", lvl:"city", wt:4, r:["easy to rent, flexible terms (like Serbia/Georgia)","medium","year's deposit / strict min. term / expensive / waitlist"] },
    { id:"logi", name:"Logistics", note:"direct flights", lvl:"city", wt:3, r:["many cheap direct flights (hub)","medium","no cheap direct flights (like Tbilisi)"] },
  ]},
  { title:"Environment & lifestyle", crits:[
    { id:"clim", name:"Climate", note:"reference: Tbilisi", lvl:"city", wt:5, r:["warm summer, dry autumn, sunny winter; ~1800-2400 sun-hours/year","noticeably off, but tolerable","dark damp winter (<60h sun) / heat / constant wind"] },
    { id:"urban", name:"Urban environment", note:"walkability", lvl:"city", wt:7, minPass:3, r:["old architecture + nice new + parks/running + specialty coffee","medium: part of the city is pleasant","nowhere to walk, dreary (like Yerevan)"] },
    { id:"people", name:"People & scene", note:"tech + community", lvl:"city", wt:9, minPass:3, r:["strong tech scene (many meetups) + lively community","something there","empty"] },
    { id:"cyc", name:"Cycling", lvl:"city", wt:5, r:["great cycling infra + real countryside rides (routes/trains)","medium","nowhere to ride / dangerous (like Istanbul), countryside out of reach"] },
    { id:"cult", name:"Culture & events", lvl:"city", wt:7, r:["tier-1/2: top concerts/museums (London/Paris/Berlin/Vienna/Amsterdam/Madrid)","tier-3: there is some, but not amazing (Barcelona/Copenhagen/Lisbon)","tier-4/5: occasionally something (Tbilisi/Belgrade and smaller)"] },
    { id:"lang", name:"Language", note:"comfort without the local language", lvl:"city", wt:5, r:["daily life fully manageable without the local language (English everywhere)","English in service, occasionally hard","hard without the local language"] },
  ]},
  { title:"Legal, taxes, prospects", crits:[
    { id:"pmzh", name:"PR track", lvl:"country", wt:7, r:["easy to get a residence permit, short path to PR, easy to maintain, sensible bureaucracy","medium","hard residence permit / long to PR / card takes months"] },
    { id:"taxes", name:"Taxes", lvl:"country", wt:5, r:["low burden / territorial (0% on foreign income) / favorable special regime","moderate","high progression on worldwide income"] },
    { id:"persp", name:"Country prospects", lvl:"country", wt:5, r:["growing hi-tech hub, healthy demographics/migration","medium","stagnation + rapid aging + poor migrant integration"] },
  ]},
  { title:"Personal", crits:[
    { id:"allergy", name:"Allergy", note:"birch", lvl:"city", wt:3, r:["little birch/pollen (Mediterranean south)","moderate","strong birch pollen in spring (north/center)"] },
    { id:"smoke", name:"Smoking ban in cafés", lvl:"country", wt:3, binary:true, r:["smoking banned in cafés","","no ban — people smoke in cafés (like Belgrade)"] },
  ]},
];

/* ---- Cities ----------------------------------------------------------------
 * mk(name, country, gatePass, ratings)
 *   ratings is an array in the exact order of K below.
 * The defaults are one person's priors — fork them and make them yours.
 */
const K = ["health","safety","clim","urban","people","cyc","cult","taxes","buro","persp","rent","logi","lang","pmzh","allergy","smoke"];
function mk(name, country, gatePass, arr){ const s={}; K.forEach((k,i)=>s[k]=arr[i]); return { name, country, g:{}, s }; }
const P=true, F=false;

const MASTER = [
  mk("Vienna","Austria",P,[5,5,4,5,3,5,4,2,4,3,3,4,4,2,1,1]),
  mk("London","UK",P,[3,3,2,5,5,3,5,3,3,3,1,5,5,4,2,1]),
  mk("Berlin","Germany",P,[4,4,3,4,5,5,4,2,3,2,2,4,4,4,1,1]),
  mk("Paris","France",P,[4,3,4,5,4,5,5,1,2,4,2,5,2,2,2,1]),
  mk("Tbilisi","Georgia",P,[4,4,5,3,4,2,2,5,4,2,5,2,4,2,3,1]),
  mk("Barcelona","Spain",P,[4,3,3,5,4,4,3,2,2,3,2,5,2,3,4,1]),
  mk("Madrid","Spain",P,[4,4,2,5,4,3,3,2,2,3,3,5,2,3,5,1]),
  mk("Munich","Germany",P,[4,5,4,4,3,4,3,2,3,2,2,3,4,4,1,1]),
  mk("Belgrade","Serbia",P,[3,4,5,3,4,3,3,4,3,2,4,3,4,4,3,0]),
  mk("Amsterdam","Netherlands",P,[2,4,2,5,4,5,3,1,5,3,2,5,5,2,2,1]),
  mk("Milan","Italy",P,[4,3,5,4,4,3,4,3,1,2,2,4,3,2,3,1]),
  mk("Copenhagen","Denmark",P,[3,5,3,4,3,5,3,1,5,3,2,4,5,2,1,1]),
  mk("Lisbon","Portugal",P,[3,4,2,5,4,2,3,2,2,3,2,3,4,2,5,1]),
  mk("Bilbao","Spain",P,[4,4,3,4,3,3,3,2,2,3,3,3,2,3,3,1]),
  mk("Brussels","Belgium",P,[4,3,1,4,3,4,3,1,2,3,3,5,4,3,2,1]),
  mk("Yerevan","Armenia",P,[3,4,3,2,4,2,2,5,4,3,4,3,4,5,4,1]),
  mk("Limassol","Cyprus",P,[4,5,3,2,4,2,2,4,4,3,2,2,4,3,5,1]),
  mk("Zurich","Switzerland",P,[5,5,3,3,2,3,3,3,4,3,1,3,4,2,2,1]),
];
const DEFAULT_TABLE = MASTER.length;

/* ---- Radar axis labels (short) & block names ------------------------------ */
const SHORT = {health:"Healthcare",buro:"Bureaucracy",safety:"Safety",rent:"Rent",logi:"Logistics",clim:"Climate",urban:"Urban",people:"People",cyc:"Cycling",cult:"Culture",lang:"Language",pmzh:"PR",taxes:"Taxes",persp:"Prospects",allergy:"Allergy",smoke:"Smoking"};
const BLOCK_SHORT = ["Infrastructure","Environment","Legal","Personal"];

/* ---- PR / residency tracks (reference tab) ---------------------------------
 * Researched for 2026 — verify before relying on any of it.
 * Row: [country, route, income/conditions, →PR?, time to PR, language, max. absence]
 */
const PMZ = [
  ["Armenia","Residence via sole proprietor / self-employment","turnover ≥1M AMD/60d or account ≥1M AMD (~€2,300)","yes","3 yrs → PR (5-yr card)","none",">183 d/yr abroad → revoked"],
  ["Armenia","Work residence","employment","yes","3 yrs → PR (5-yr card)","none","same"],
  ["Austria","Settlement without work rights (passive)","~€2,178/mo + insurance + housing · QUOTA","yes","5 yrs","B1","EU LTR >12 mo outside EEA"],
  ["Austria","Rot-Weiß-Rot (work/business)","RWR points","yes","5 yrs","B1","same"],
  ["Belgium","Professional Card (self-employment)","~€22,838 in account + ~€26,087/yr","yes","5 yrs","no test","EU LTR >12 mo outside EU"],
  ["Belgium","Single Permit (work)","employment contract","yes","5 yrs","no test","same"],
  ["Cyprus","Category F (passive, no work)","income €9,568/yr +€4,613/dependent","yes","PR immediately, but 5-7 yr backlog","none","not >2 yrs in a row abroad"],
  ["Cyprus","Fast-track 6(2) — investment","property €300,000 + income €50,000/yr","PR immediately","2-6 mo","none","visit once every 2 yrs"],
  ["Cyprus","EU LTR (5 yrs residence: DNV €3,500/mo, work)","5 yrs continuous residence","yes","5 yrs","A2 Greek","not >2 yrs in a row abroad"],
  ["Denmark","Work (Pay Limit / Startup Denmark)","DKK 346,156/2 yrs + employed 3.5 of 4 yrs","yes","8 yrs (sometimes 4)","PD2 (≈B1–B2)","usually >6 mo (up to 12 with >2 yrs tenure)"],
  ["France","Visiteur (passive, no work allowed)","SMIC €1,443/mo (de facto higher)","yes","5 yrs","B1 (from 2026)",">3 yrs in a row → lost"],
  ["France","Profession libérale (self-employment)","~€22,404/yr + project approval","yes","5 yrs","B1","same"],
  ["France","Passeport Talent (skilled / startup / business)","salary ≥€39,582/yr · startup via incubator (no threshold) · business €30k+ · investor €300k+","yes","5 yrs","B1 (from 2026)",">6 mo in a row / >10 mo total abroad"],
  ["Georgia","Residence via sole proprietor","turnover ~50,000 GEL/yr","yes","10 yrs","none","no strict limit; IT residence ≥183 d/yr"],
  ["Germany","Freelance §21 (self-employment)","business plan + contracts with German clients","yes","5 yrs (3 if business is stable)","B1","national >6 mo / EU LTR >12 mo outside EU"],
  ["Germany","Blue Card (work)","Blue Card salary threshold","yes","21 mo","B1","same"],
  ["Italy","Elective residence (passive only)","€32,000/yr (couple €38,000)","yes","5 yrs","A2",">12 mo outside EU"],
  ["Italy","Digital Nomad (remote)","€28,000/yr","yes","5 yrs","A2","same"],
  ["Netherlands","Self-employed (points)","avg profit ~€1,735/mo","yes","5 yrs","A2","national >6 mo / EU LTR >12 mo"],
  ["Netherlands","Highly Skilled Migrant (work)","≥30 y.o. ~€5,688/mo · <30 y.o. ~€4,171/mo","yes","5 yrs","A2","same"],
  ["Portugal","D7 (passive)","€920/mo + savings","yes","5 yrs","A2","6 mo in a row / 8 mo total"],
  ["Portugal","D8 Digital Nomad (residence form only)","~€3,280/mo · temp-stay does NOT count","yes*","5 yrs","A2","6 / 8 mo"],
  ["Serbia","Residence via own company","≥€8,520/yr or hire 1 Serbian","yes","3 yrs","none",">10 mo total / >6 mo at once over 3 yrs"],
  ["Serbia","Self-employment / remote","~€3,500/mo (over 6 mo)","yes","3 yrs","none","same"],
  ["Spain","NLV (passive, no work)","€2,400/mo +€600/mo per family member","yes","5 yrs","none","6 mo in a row / 10 mo over 5 yrs; card — 12 mo outside EU"],
  ["Spain","Digital Nomad (remote)","~€2,760/mo","yes (1:1)","5 yrs","none","same"],
  ["Spain","Startup / entrepreneur (Ley de Startups)","innovative project + ENISA approval","yes","5 yrs","none","same"],
  ["Switzerland","Work (permit B → C)","employment contract + cantonal approval","yes","10 yrs → C-permit","German/French A1-A2 (canton)","C lapses if away >6 mo"],
  ["Switzerland","Lump-sum (Pauschalbesteuerung)","lump-sum tax ~CHF 250k+/yr, no work","yes","10 yrs","depends on canton","same"],
  ["UK","Skilled Worker → ILR","£41,700/yr + sponsor","yes","5 yrs (2026 reform → possibly 10)","B1",">2 yrs abroad → ILR lost"],
  ["UK","Global Talent → ILR","endorsement (no salary threshold)","yes","3–5 yrs","B1","same"],
];

const PMZ_DETAILS = {
  "Germany":"No DNV or passive-income visa. Freelance §21 can grant PR in 3 years with a stable business. The fast-track 3-year naturalization was cancelled in Oct 2025 (now 5 years). The Niederlassungserlaubnis lapses if you're away >6 mo without prior arrangement; the EU version — up to 12 mo outside the EU.",
  "Austria":"The passive route ('settlement without work rights') is QUOTA-BASED: a narrow booking window (for the 2026 quota, booking opened for ~a week). Requires income ~2× the subsistence minimum. Naturalization usually ~10 years.",
  "Netherlands":"Self-employed is assessed on a points system, not just income. Inburgering A2. Naturalization 5 years.",
  "Belgium":"The Professional Card is handled differently in the 3 regions (Brussels / Flanders / Wallonia). For PR itself there is no language test — 'integration' is required. For citizenship — knowledge of one of the 3 official languages (~A2).",
  "Spain":"IPREM 2026 = €600/mo — the basis for thresholds (NLV = 400% IPREM). DNV and NLV count toward PR 1:1. No language needed for PR at all (DELE A2 — only for citizenship). Citizenship 10 years; Spain does not recognize dual citizenship.",
  "Italy":"Elective residence — passive income only (pensions / rent / dividends), no work or self-employment allowed. DNV (since 2024) is a full permesso and counts. Language A2 — test at the prefecture (pass mark 80/100).",
  "Portugal":"⚠️ D8 comes in two forms: a residence visa (counts toward PR) and temporary-stay up to 1 year (does NOT). AIMA processing takes 6-9 mo (backlog). Citizenship under the law of 19.05.2026 — 10 years (PR still 5).",
  "France":"The Visiteur visa BANS any work, including remote — freelancing requires Profession libérale status (since 2025 — prior project approval via ANEF). Passeport Talent (the 'Talent' card): a 4-year card up front, family gets status automatically with the right to work, and most categories need no separate work permit; the fast-track to 3 years is only for countries with bilateral agreements (5 years otherwise). Language for the carte de résident (10 years) — B1 from 01.01.2026 + a civics exam.",
  "Switzerland":"PR (C-permit) usually after 10 years (5 years — only for EU/US citizens under treaties; others 10 years). No DNV/passive visa; for the wealthy without work — lump-sum taxation (Pauschalbesteuerung) grants residence. Switzerland is in Schengen (but not the EU) — residence grants movement. Very expensive; language depends on the canton (German/French/Italian).",
  "UK":"⚠️ The 'Earned Settlement' reform (Nov 2025): the baseline time to ILR may rise from 5 to 10 years (Global Talent ~3, less for high earners). Consultation until 12.02.2026, rollout from April 2026 — possibly retroactive for those who arrived in 2022-24. The investor visa has been closed since 2022.",
  "Serbia":"Visa-free entry for many nationalities is in effect (2026). Residence via one's own company is a popular route; when renewing via a startup you must hire 1 Serbian OR have income ≥€8,520/yr. There is EU pressure to align visa policy, but visa-free holds for now.",
  "Georgia":"Visa-free stay up to 365 days for many nationalities. PR — 10 years (the May 2021 reform scrapped the former 6). Visa-free years do NOT count — only time on an issued residence permit. Territorial taxes.",
  "Denmark":"No passive/DNV route — only work / Startup Denmark. PR: baseline conditions + at least 2 of 4 additional criteria.",
  "Cyprus":"Three different statuses: Category F (permanent, income-based, but processing now 5-7 years — a huge backlog), fast-track 6(2) (invest €300k → PR in 2-6 mo), EU LTR (after 5 years of any residence — only here is Greek A2 required). Non-dom: 0% on dividends/interest for 17 years. Cyprus is an EU member but NOT Schengen (residence does not grant Schengen visa-free travel). Naturalization 7-8 years (Greek B1).",
  "Armenia":"From 01.08.2026 — a new migration package: online submission only, state fees non-refundable even on rejection. Under the reform, business/work now require 3 years of residence → a 5-year PR card (previously there was no threshold for business). A sole proprietorship registers online in 2-3 days, 100% foreign ownership. Citizenship after 3 years (a Constitution test in Armenian), dual citizenship allowed. EAEU/CIS.",
};
