export type FieldType = "text" | "textarea" | "date" | "select";

export interface FieldDef {
  id: string;
  label: string;
  placeholder?: string;
  type: FieldType;
  options?: string[];
  required: boolean;
  hint?: string;
}

export interface DisputeCategory {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  desc: string;
}

export interface SubCategory {
  id: string;
  label: string;
  sublabel: string;
  authorities: string[];
}

export interface AuthorityDef {
  id: string;
  label: string;
  sublabel: string;
}

// ─── Dispute Categories ────────────────────────────────────────────────────────

export const DISPUTE_CATEGORIES: DisputeCategory[] = [
  {
    id: "jamin",
    label: "जमीन / महसूल वाद",
    sublabel: "Land & Revenue Disputes",
    icon: "🏡",
    desc: "फेरफार आक्षेप, वारस नोंद, वाटणी, नाव दुरुस्ती, अतिक्रमण",
  },
  {
    id: "affidavit",
    label: "प्रतिज्ञापत्र",
    sublabel: "Affidavit",
    icon: "✍️",
    desc: "नाव दुरुस्ती, वय/DOB दुरुस्ती, जात प्रमाणपत्र, सामान्य शपथपत्र",
  },
  {
    id: "takrar",
    label: "तक्रार",
    sublabel: "Complaint",
    icon: "⚖️",
    desc: "पोलीस तक्रार, ग्राहक तक्रार, महिला सहाय्यता",
  },
  {
    id: "rti",
    label: "RTI अर्ज",
    sublabel: "RTI Application",
    icon: "🔍",
    desc: "माहितीचा अधिकार अधिनियम, २००५ अंतर्गत माहिती मागणी",
  },
  {
    id: "notice",
    label: "कायदेशीर नोटीस",
    sublabel: "Legal Notice",
    icon: "📨",
    desc: "विरुद्ध पक्षाला औपचारिक कायदेशीर नोटीस",
  },
];

// ─── Sub-Categories ────────────────────────────────────────────────────────────

export const SUB_CATEGORIES: Record<string, SubCategory[]> = {
  jamin: [
    { id: "ferfer_aakshep", label: "फेरफार आक्षेप", sublabel: "Mutation Objection", authorities: ["talathi", "mandal"] },
    { id: "varas_nond", label: "वारस नोंद", sublabel: "Succession / Inheritance Entry", authorities: ["talathi"] },
    { id: "vatni", label: "वाटणी / हिस्सा", sublabel: "Partition", authorities: ["tahsildar", "court"] },
    { id: "naav_durusti", label: "नाव / नोंद दुरुस्ती", sublabel: "Name / Record Correction", authorities: ["talathi", "tahsildar"] },
    { id: "vikri_aakshep", label: "विक्री आक्षेप", sublabel: "Sale Objection", authorities: ["tahsildar", "mandal"] },
    { id: "aatkraman", label: "अतिक्रमण", sublabel: "Encroachment", authorities: ["mandal", "tahsildar"] },
  ],
  affidavit: [
    { id: "naav_correction", label: "नाव दुरुस्ती", sublabel: "Name Correction Affidavit", authorities: ["notary"] },
    { id: "vaay_correction", label: "वय / DOB दुरुस्ती", sublabel: "Age / DOB Correction", authorities: ["notary"] },
    { id: "jaat_cert", label: "जात प्रमाणपत्र", sublabel: "Caste Certificate Affidavit", authorities: ["notary"] },
    { id: "general_affidavit", label: "सामान्य प्रतिज्ञापत्र", sublabel: "General Affidavit", authorities: ["notary"] },
  ],
  takrar: [
    { id: "police_takrar", label: "पोलीस तक्रार", sublabel: "Police Complaint", authorities: ["police"] },
    { id: "grahak_takrar", label: "ग्राहक तक्रार", sublabel: "Consumer Complaint", authorities: ["consumer_forum"] },
    { id: "mahila_takrar", label: "महिला तक्रार", sublabel: "Women's Cell Complaint", authorities: ["police", "mahila_cell"] },
  ],
  rti: [
    { id: "rti_general", label: "RTI अर्ज", sublabel: "RTI Application", authorities: ["rti_officer"] },
  ],
  notice: [
    { id: "legal_notice", label: "कायदेशीर नोटीस", sublabel: "Legal Notice", authorities: ["opposite_party"] },
  ],
};

// ─── Authorities ───────────────────────────────────────────────────────────────

export const AUTHORITIES: Record<string, AuthorityDef> = {
  talathi:        { id: "talathi",        label: "तलाठी",                  sublabel: "Village Revenue Officer" },
  mandal:         { id: "mandal",         label: "मंडळ अधिकारी",            sublabel: "Circle Officer" },
  tahsildar:      { id: "tahsildar",      label: "तहसीलदार",                sublabel: "Tahsildar" },
  jilhadhikari:   { id: "jilhadhikari",   label: "जिल्हाधिकारी",            sublabel: "District Collector" },
  police:         { id: "police",         label: "पोलीस ठाणे",              sublabel: "Police Station" },
  court:          { id: "court",          label: "दिवाणी न्यायालय",          sublabel: "Civil Court" },
  consumer_forum: { id: "consumer_forum", label: "ग्राहक मंच",              sublabel: "Consumer Forum" },
  notary:         { id: "notary",         label: "नोटरी / न्यायदंडाधिकारी", sublabel: "Notary / Magistrate" },
  mahila_cell:    { id: "mahila_cell",    label: "महिला सहाय्यता कक्ष",     sublabel: "Women's Cell" },
  rti_officer:    { id: "rti_officer",    label: "जन माहिती अधिकारी",       sublabel: "Public Information Officer" },
  opposite_party: { id: "opposite_party", label: "विरुद्ध पक्ष",            sublabel: "Opposite Party" },
};

// ─── Common field blocks ───────────────────────────────────────────────────────

const REVENUE_LOCATION: FieldDef[] = [
  { id: "village",   label: "गाव",                    placeholder: "वडगाव",  type: "text", required: true },
  { id: "taluka",    label: "तालुका",                  placeholder: "पुणे",   type: "text", required: true },
  { id: "district",  label: "जिल्हा",                  placeholder: "पुणे",   type: "text", required: true },
  { id: "gutNumber", label: "गट क्रमांक / सर्वे नंबर", placeholder: "गट नं. १२३", type: "text", required: true },
];

// ─── Field Configs per sub-category ───────────────────────────────────────────

export const FIELD_CONFIGS: Record<string, FieldDef[]> = {
  ferfer_aakshep: [
    ...REVENUE_LOCATION,
    { id: "currentHolder",  label: "सध्याचे ७/१२ धारक (नाव)",   placeholder: "सध्या सातबारावर कोणाचे नाव आहे",                        type: "text",     required: true  },
    { id: "ferferNumber",   label: "फेरफार नोंद क्रमांक",        placeholder: "फेरफार क्र. ४५/२०२३-२४",                                type: "text",     required: false, hint: "माहीत असल्यास" },
    { id: "ferferDate",     label: "फेरफार नोंदीची तारीख",       placeholder: "",                                                       type: "date",     required: false },
    { id: "jointProperty",  label: "जमीन संयुक्त आहे का?",       placeholder: "",                                                       type: "select",   required: true,  options: ["होय", "नाही", "माहीत नाही"] },
    { id: "yourRight",      label: "या जमिनीवर तुमचा हक्क / संबंध", placeholder: "मी मृत धारकाचा मुलगा / वारस आहे…",                  type: "textarea", required: true  },
    { id: "objectionReason",label: "आक्षेपाचे कारण (तपशीलवार)", placeholder: "या फेरफार नोंदीस माझा आक्षेप का आहे — तथ्ये व कारणे…", type: "textarea", required: true  },
    { id: "previousSteps",  label: "आधी कोणती कारवाई केली? (असल्यास)", placeholder: "तलाठ्याकडे तोंडी सांगितले / पत्र दिले…",           type: "textarea", required: false },
  ],

  varas_nond: [
    ...REVENUE_LOCATION,
    { id: "deceasedName",      label: "मृत व्यक्तीचे नाव (पूर्वीचे ७/१२ धारक)", placeholder: "विठ्ठल रामचंद्र पाटील", type: "text",     required: true  },
    { id: "deathDate",         label: "मृत्यूची तारीख",                           placeholder: "",                       type: "date",     required: false },
    { id: "heirsList",         label: "सर्व वारसांची यादी",                       placeholder: "१. रामचंद्र (मुलगा)\n२. सुनिता (मुलगी)\n३. कमलाबाई (पत्नी)", type: "textarea", required: true },
    { id: "religionContext",   label: "धर्म / वारस कायदा",                       placeholder: "",                       type: "select",   required: true,  options: ["हिंदू (Hindu Succession Act)", "मुस्लिम (Muslim Personal Law — Shia/Sunni)", "बौद्ध", "ख्रिश्चन", "इतर"] },
    { id: "existingMutation",  label: "फेरफार नोंद आधीच झाली का?",              placeholder: "",                       type: "select",   required: true,  options: ["नाही, अजून झाली नाही", "होय, झाली आहे", "प्रलंबित आहे"] },
    { id: "additionalInfo",    label: "इतर महत्त्वाची माहिती",                   placeholder: "मागील नोंदी, वाद असल्यास, जॉईंट होल्डिंग…", type: "textarea", required: false },
  ],

  vatni: [
    ...REVENUE_LOCATION,
    { id: "jointOwners",      label: "सह-मालकांची नावे",          placeholder: "१. रामचंद्र पाटील\n२. विठ्ठल पाटील", type: "textarea", required: true },
    { id: "myShare",          label: "तुमचा हिस्सा किती असावा?",  placeholder: "१/३ भाग / समान वाटणी / विशिष्ट क्षेत्र", type: "text", required: true },
    { id: "partitionBasis",   label: "वाटणीचा आधार",              placeholder: "वडिलांच्या मृत्यूनंतर समान वाटणी / कोर्टाचा हुकूम…", type: "textarea", required: true },
    { id: "agreeToPartition", label: "सर्व मालक सहमत आहेत का?",  placeholder: "",                                       type: "select",   required: true,  options: ["होय, सर्व सहमत", "नाही, वाद आहे", "काही सहमत नाहीत"] },
  ],

  naav_durusti: [
    ...REVENUE_LOCATION,
    { id: "wrongEntry",      label: "७/१२ वर सध्याची (चुकीची) नोंद", placeholder: "सध्या ७/१२ वर काय लिहिले आहे",  type: "text",     required: true  },
    { id: "correctEntry",    label: "योग्य नोंद काय असायला हवी",     placeholder: "काय असायला हवे होते",          type: "text",     required: true  },
    { id: "correctionReason",label: "नोंद चुकीची का आहे?",            placeholder: "लेखनिक चूक / नाव बदलले / चुकीचे मोजमाप…", type: "textarea", required: true  },
    { id: "proofAvailable",  label: "दुरुस्तीसाठी उपलब्ध पुरावे",   placeholder: "जुने दस्त, खरेदीपत्र, आधार कार्ड…",      type: "text",     required: false },
  ],

  vikri_aakshep: [
    ...REVENUE_LOCATION,
    { id: "currentHolder",   label: "विक्रेत्याचे नाव (सध्याचे ७/१२ धारक)", placeholder: "जमीन विकणाऱ्याचे नाव",                     type: "text",     required: true  },
    { id: "buyerName",       label: "खरेदीदाराचे नाव",                       placeholder: "ज्याने विकत घेतले",                         type: "text",     required: true  },
    { id: "saleDate",        label: "विक्री व्यवहाराची तारीख",               placeholder: "",                                           type: "date",     required: false },
    { id: "yourRight",       label: "या जमिनीवर तुमचा हक्क काय?",           placeholder: "सह-मालक / वारस / जमीन बळजबरीने विकली…",     type: "textarea", required: true  },
    { id: "objectionReason", label: "आक्षेपाचे कारण (तपशीलवार)",            placeholder: "माझी संमती न घेता विक्री / बनावट दस्त / हक्क डावलला…", type: "textarea", required: true },
  ],

  aatkraman: [
    ...REVENUE_LOCATION,
    { id: "encroachmentBy",      label: "अतिक्रमण कोणी केले?",       placeholder: "शेजाऱ्याचे नाव / अज्ञात व्यक्ती",     type: "text",     required: true  },
    { id: "encroachmentArea",    label: "अतिक्रमण केलेले क्षेत्र",   placeholder: "अंदाजे किती क्षेत्रफळ / हद्द",          type: "text",     required: false },
    { id: "encroachmentDate",    label: "अतिक्रमण कधी सुरू झाले?",   placeholder: "",                                       type: "date",     required: false },
    { id: "encroachmentDetails", label: "अतिक्रमणाचे स्वरूप",        placeholder: "भिंत बांधली / शेत बळकावले / बांधकाम…",   type: "textarea", required: true  },
    { id: "previousComplaints",  label: "आधी तक्रार केली का?",       placeholder: "ग्रामपंचायत / पोलीस / तलाठी — काय झाले?", type: "textarea", required: false },
  ],

  naav_correction: [
    { id: "doc1Type", label: "दस्तऐवज १ चा प्रकार",      placeholder: "आधार कार्ड / १२वी मार्कशीट",   type: "text", required: true },
    { id: "doc1Name", label: "दस्तऐवज १ वरील नाव",       placeholder: "दस्तऐवज १ वर काय नाव आहे",      type: "text", required: true },
    { id: "doc2Type", label: "दस्तऐवज २ चा प्रकार",      placeholder: "जात प्रमाणपत्र / जन्म दाखला",   type: "text", required: true },
    { id: "doc2Name", label: "दस्तऐवज २ वरील नाव",       placeholder: "दस्तऐवज २ वर काय नाव आहे",      type: "text", required: true },
    { id: "purpose",  label: "प्रतिज्ञापत्राचा उद्देश",  placeholder: "महाविद्यालय प्रवेश / नोकरी / शासकीय योजना", type: "text", required: true },
    { id: "additionalDocs", label: "इतर दस्तऐवज (वेगळे नाव असल्यास)", placeholder: "पासपोर्ट, मतदार ओळखपत्र…", type: "text", required: false },
    { id: "discrepancyExplain", label: "नावातील फरकाचे कारण", placeholder: "लेखनातील चूक / वेगळ्या भाषांमुळे / टंकलेखन चूक", type: "text", required: false },
  ],

  vaay_correction: [
    { id: "wrongDOB",        label: "दस्तऐवजावरील चुकीची जन्मतारीख", placeholder: "०१/०१/२०००", type: "text", required: true  },
    { id: "correctDOB",      label: "खरी जन्मतारीख",                  placeholder: "१५/०८/२०००", type: "text", required: true  },
    { id: "docWithWrongDOB", label: "चुकीची तारीख कोणत्या दस्तऐवजात?", placeholder: "शाळा सोडल्याचा दाखला / जन्म दाखला", type: "text", required: true },
    { id: "purpose",         label: "प्रतिज्ञापत्राचा उद्देश",        placeholder: "नोकरी / पासपोर्ट / शासकीय योजना",  type: "text", required: true },
  ],

  jaat_cert: [
    { id: "casteOnCert",       label: "जात प्रमाणपत्रावरील नाव",    placeholder: "सोहेल / रामेश्वर",              type: "text", required: true  },
    { id: "nameOnOtherDocs",   label: "इतर दस्तऐवजांवरील नाव",     placeholder: "सोहाईल / रामेश्वर कुमार",       type: "text", required: true  },
    { id: "caste",             label: "जात / प्रवर्ग",              placeholder: "OBC / SC / ST / NT / SBC",       type: "text", required: true  },
    { id: "purpose",           label: "उद्देश",                     placeholder: "महाविद्यालय प्रवेश OBC आरक्षण / शासकीय नोकरी", type: "text", required: true },
    { id: "discrepancyExplain",label: "नावातील फरकाचे कारण",       placeholder: "लेखनातील चूक / भाषांतर फरक",    type: "text", required: false },
  ],

  general_affidavit: [
    { id: "affidavitPurpose", label: "प्रतिज्ञापत्राचा उद्देश",    placeholder: "कशासाठी शपथपत्र हवे आहे?",                     type: "text",     required: true },
    { id: "statements",       label: "शपथेवर सांगायचे मुद्दे",     placeholder: "एक एक मुद्दा लिहा — सत्य काय आहे ते स्पष्टपणे…", type: "textarea", required: true },
  ],

  police_takrar: [
    { id: "policeStation",       label: "पोलीस ठाणे",               placeholder: "कोणत्या ठाण्यात तक्रार द्यायची?",                type: "text",     required: true  },
    { id: "incidentDate",        label: "घटनेची तारीख",              placeholder: "",                                                type: "date",     required: true  },
    { id: "incidentPlace",       label: "घटनेचे ठिकाण",             placeholder: "नक्की कुठे घटना घडली",                           type: "text",     required: true  },
    { id: "accusedName",         label: "आरोपीचे नाव व पत्ता",      placeholder: "माहीत असल्यास — नाव, पत्ता, मोबाईल",            type: "text",     required: false },
    { id: "incidentDescription", label: "घटनेचे संपूर्ण वर्णन",    placeholder: "काय झाले, कसे झाले, कोण होते — कालानुक्रमे…",    type: "textarea", required: true  },
    { id: "witnesses",           label: "साक्षीदार",                 placeholder: "कोणी पाहिले असल्यास नाव सांगा",                  type: "text",     required: false },
    { id: "evidence",            label: "उपलब्ध पुरावे",            placeholder: "फोटो, व्हिडिओ, वैद्यकीय अहवाल, इतर",             type: "text",     required: false },
  ],

  grahak_takrar: [
    { id: "companyName",      label: "कंपनी / विक्रेत्याचे नाव", placeholder: "ज्याच्याविरुद्ध तक्रार आहे",                  type: "text",     required: true  },
    { id: "productService",   label: "उत्पादन / सेवा",           placeholder: "कोणते उत्पादन किंवा सेवा",                     type: "text",     required: true  },
    { id: "purchaseDate",     label: "खरेदी / व्यवहाराची तारीख", placeholder: "",                                              type: "date",     required: false },
    { id: "amountPaid",       label: "भरलेली रक्कम",             placeholder: "₹ रक्कम",                                      type: "text",     required: false },
    { id: "complaintDetails", label: "तक्रारीचा तपशील",          placeholder: "काय समस्या आली — खराब माल / पैसे परत न केल्याबद्दल…", type: "textarea", required: true },
    { id: "reliefSought",     label: "मागणी / अपेक्षित निवारण", placeholder: "पैसे परत / उत्पादन बदलून द्या / नुकसान भरपाई", type: "text",     required: true  },
  ],

  mahila_takrar: [
    { id: "complaintAgainst",  label: "ज्याच्याविरुद्ध तक्रार", placeholder: "नाव व नाते — पती / सासू / सहकारी…", type: "text",     required: true  },
    { id: "incidentDate",      label: "घटनेची तारीख",            placeholder: "",                                   type: "date",     required: false },
    { id: "incidentDetails",   label: "घटनेचे वर्णन",           placeholder: "काय झाले ते सांगा — कालानुक्रमे…",   type: "textarea", required: true  },
    { id: "witnesses",         label: "साक्षीदार",               placeholder: "कोणी पाहिले असल्यास नाव",           type: "text",     required: false },
  ],

  rti_general: [
    { id: "department",          label: "विभाग / कार्यालय",                 placeholder: "कोणत्या कार्यालयाकडून माहिती हवी?",                 type: "text",     required: true  },
    { id: "departmentAddress",   label: "कार्यालयाचा पत्ता",               placeholder: "पूर्ण पत्ता",                                        type: "text",     required: true  },
    { id: "informationRequired", label: "कोणती माहिती हवी?",               placeholder: "मला पुढील माहिती हवी आहे:\n१. \n२. \n३.",            type: "textarea", required: true  },
    { id: "period",              label: "कोणत्या कालावधीची माहिती?",       placeholder: "२०२०-२०२४ / गेल्या ५ वर्षांची",                      type: "text",     required: false },
    { id: "feeMode",             label: "शुल्क भरण्याचे माध्यम",           placeholder: "",                                                    type: "select",   required: true,  options: ["रोख (Cash)", "पोस्टल ऑर्डर (IPO)", "डिमांड ड्राफ्ट (DD)", "ऑनलाइन"] },
  ],

  legal_notice: [
    { id: "oppositeParty",   label: "विरुद्ध पक्षाचे नाव",       placeholder: "ज्याला नोटीस पाठवायची",                          type: "text",     required: true  },
    { id: "oppositeAddress", label: "विरुद्ध पक्षाचा पत्ता",     placeholder: "पूर्ण पत्ता",                                     type: "text",     required: true  },
    { id: "disputeDetails",  label: "वादाचा तपशील",               placeholder: "वाद काय आहे, कधी झाला, कसा झाला…",              type: "textarea", required: true  },
    { id: "legalBasis",      label: "कायदेशीर आधार / हक्क",      placeholder: "तुमचा कायदेशीर हक्क / कोणत्या करारावर आधारित",  type: "textarea", required: false },
    { id: "demand",          label: "मागणी",                      placeholder: "काय करायला सांगणार? पैसे परत / जमीन सोडा…",     type: "text",     required: true  },
    { id: "noticePeriod",    label: "नोटीस कालावधी",              placeholder: "",                                                type: "select",   required: true,  options: ["७ दिवस", "१५ दिवस", "३० दिवस"] },
  ],
};

// ─── Annexure Recommendations ─────────────────────────────────────────────────

export const ANNEXURE_MAP: Record<string, string[]> = {
  ferfer_aakshep: [
    "७/१२ उतारा (सातबारा) — सध्याची स्थिती",
    "फेरफार नोंद उतारा (Mutation Extract)",
    "८-अ उतारा (खातेदार नोंद)",
    "मृत्यू प्रमाणपत्र (वारस असल्यास)",
    "नातेसंबंधाचे पुरावे (रेशन कार्ड / जन्म दाखला)",
    "मागील तक्रारींच्या प्रती (असल्यास)",
  ],
  varas_nond: [
    "मृत्यू प्रमाणपत्र",
    "७/१२ उतारा (मृत धारकाच्या नावाचा)",
    "८-अ उतारा",
    "कुटुंब नोंदणी उतारा (Family Register)",
    "सर्व वारसांचे आधार कार्ड",
    "वारस दाखला (शक्य असल्यास)",
    "मुस्लिम वारस असल्यास — निकाहनामा / वंशावळी",
  ],
  vatni: [
    "७/१२ उतारा",
    "८-अ उतारा",
    "मागील वाटणीपत्र (असल्यास)",
    "मृत्यू प्रमाणपत्र (आवश्यक असल्यास)",
    "सर्व सह-मालकांचे ओळखपत्र",
    "न्यायालयाचा आदेश (असल्यास)",
  ],
  naav_durusti: [
    "७/१२ उतारा (चुकीची नोंद दर्शवणारा)",
    "खरेदीपत्र / मूळ दस्तऐवज (योग्य नाव असलेला)",
    "आधार कार्ड",
    "मागील ७/१२ (योग्य नोंद असल्यास)",
  ],
  vikri_aakshep: [
    "७/१२ उतारा",
    "फेरफार उतारा",
    "तुमचे मालकी हक्काचे पुरावे",
    "विक्री व्यवहाराची माहिती (रजिस्ट्री तपशील असल्यास)",
  ],
  aatkraman: [
    "७/१२ उतारा",
    "मोजणी नकाशा (शक्य असल्यास)",
    "फोटो / व्हिडिओ पुरावे",
    "साक्षीदार यादी",
    "मागील तक्रारींच्या प्रती",
  ],
  naav_correction: [
    "आधार कार्ड",
    "१२वी / १०वी गुणपत्रिका",
    "जात प्रमाणपत्र",
    "जन्म दाखला",
    "इतर सर्व दस्तऐवज जिथे नाव वेगळे आहे",
  ],
  vaay_correction: [
    "जन्म दाखला",
    "शाळा सोडल्याचा दाखला (LC)",
    "आधार कार्ड",
    "पासपोर्ट (असल्यास)",
  ],
  jaat_cert: [
    "जात प्रमाणपत्र",
    "आधार कार्ड",
    "१२वी / १०वी गुणपत्रिका",
    "शाळा सोडल्याचा दाखला (LC)",
    "रेशन कार्ड",
  ],
  general_affidavit: [
    "संबंधित ओळखपत्र / दस्तऐवज",
  ],
  police_takrar: [
    "वैद्यकीय अहवाल (दुखापत असल्यास)",
    "फोटो / व्हिडिओ पुरावे",
    "साक्षीदारांची यादी",
    "मागील तक्रारींच्या प्रती (असल्यास)",
  ],
  grahak_takrar: [
    "खरेदी पावती / बिल",
    "वॉरंटी / गॅरंटी कार्ड",
    "दोषपूर्ण उत्पादनाचे फोटो",
    "कंपनीशी पत्रव्यवहाराच्या प्रती",
    "बँक स्टेटमेंट (पेमेंट पुरावा)",
  ],
  mahila_takrar: [
    "वैद्यकीय अहवाल (असल्यास)",
    "फोटो / व्हिडिओ पुरावे",
    "साक्षीदारांची यादी",
    "मागील तक्रारींच्या प्रती",
  ],
  rti_general: [
    "शुल्क भरल्याची पावती (रु. १०/-)",
    "अर्जदाराचे ओळखपत्र",
  ],
  legal_notice: [
    "संबंधित करार / दस्तऐवज",
    "मागील पत्रव्यवहाराच्या प्रती",
    "नुकसान दर्शवणारे पुरावे",
  ],
};
