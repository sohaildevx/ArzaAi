import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SUB_CATEGORIES } from "@/lib/document-config";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GenerateRequest {
  category: string;
  subCategory: string;
  authority: string;
  applicantName: string;
  applicantAddress: string;
  date: string;
  fields: Record<string, string>;
}


function getAuthorityPrompt(authority: string): string {
  const prompts: Record<string, string> = {
    talathi: `तुम्ही तलाठी कार्यालयात सादर होणारे महसूल अर्ज/निवेदन तयार करण्यात तज्ञ आहात.
- गाव पातळीवरील साधी, स्पष्ट, तथ्य-आधारित मराठी भाषा वापरा.
- गट क्रमांक, सर्वे नंबर, फेरफार नोंद क्रमांक, ७/१२ उतारा यांचा योग्य उल्लेख करा.
- महाराष्ट्र जमीन महसूल अधिनियम, १९६६ च्या संबंधित कलमांचा उल्लेख जेथे लागू असेल.
- "मा. तलाठी साहेब" असे संबोधन वापरा.
- भाषा अतिशय व्यावहारिक ठेवा — कार्यालयात प्रत्यक्ष वापरल्या जाणाऱ्या शब्दावली वापरा.`,

    mandal: `तुम्ही मंडळ अधिकारी (Circle Officer) कार्यालयात सादर होणारे महसूल अर्ज तयार करण्यात तज्ञ आहात.
- औपचारिक महाराष्ट्र महसूल प्रशासन भाषा वापरा.
- गट क्रमांक, फेरफार नोंद, मागील आदेश यांचा उल्लेख करा.
- "मा. मंडळ अधिकारी साहेब" असे संबोधन वापरा.
- तलाठी पातळीवर प्रश्न सुटला नसल्यास वरिष्ठ अधिकाऱ्याकडे अपील करण्याचा टोन ठेवा.
- महाराष्ट्र जमीन महसूल अधिनियम कलम उद्धृत करा जेथे लागू असेल.`,

    tahsildar: `तुम्ही तहसीलदार कार्यालयात सादर होणारे अर्ज तयार करण्यात तज्ञ आहात.
- औपचारिक महाराष्ट्र महसूल प्रशासनाची प्रमाणित भाषा वापरा.
- Maharashtra Land Revenue Code, 1966 आणि Maharashtra Revenue Tribunal Act चे लागू कलम उद्धृत करा.
- "मा. तहसीलदार साहेब" असे संबोधन वापरा.
- तथ्ये, दिनांक, नोंदी, मागील आदेश यांना प्राधान्य द्या.
- विनंतीचा भाग स्पष्ट आणि विशिष्ट ठेवा — काय करायला सांगायचे आहे ते नक्की लिहा.`,

    police: `तुम्ही पोलीस ठाण्यात सादर होणारी तक्रार/FIR अर्ज तयार करण्यात तज्ञ आहात.
- घटनाक्रम स्पष्ट, कालानुक्रमिक (chronological) आणि तथ्य-आधारित ठेवा.
- आरोपींची ओळख, घटनेची वेळ, ठिकाण, साक्षीदार, पुरावे यांचा स्पष्ट उल्लेख करा.
- "मा. पोलीस निरीक्षक साहेब" असे संबोधन वापरा.
- गुन्ह्याच्या स्वरूपानुसार संबंधित IPC / BNS कलम सुचवा (फक्त लागू असतील तेच — अतिशयोक्ती टाळा).
- भाषा साधी, थेट आणि तक्रारदाराच्या दृष्टिकोनातून असावी.`,

    court: `तुम्ही दिवाणी न्यायालयात सादर होणारे अर्ज/दावा तयार करण्यात तज्ञ आहात.
- "अर्जदार" आणि "प्रतिवादी" असे औपचारिक पक्ष-नाम वापरा.
- "मा. न्यायाधीश साहेब" असे संबोधन वापरा.
- कायदेशीर भाषा वापरा पण अतिगुंतागुंतीची नको.
- प्रार्थना (Prayer) विभाग स्पष्टपणे लिहा — न्यायालयाने काय करावे ते नक्की सांगा.
- Code of Civil Procedure, 1908 संदर्भ द्या जेथे लागू असेल.`,

    notary: `तुम्ही नोटरी / न्यायदंडाधिकारी यांच्यासमोर सादर होणारे प्रतिज्ञापत्र (Affidavit) तयार करण्यात तज्ञ आहात.
- प्रमाणित प्रतिज्ञापत्र फॉर्मेट वापरा: शीर्षक, शपथकर्त्याची ओळख, क्रमांकित विधाने, शपथेचे विधान.
- विधाने क्रमांकित (१, २, ३...) आणि स्वतंत्र असावीत.
- शेवटी शपथेचे प्रमाणित विधान आणि नोटरी शिक्क्याची जागा असावी.
- IPC कलम १९३ अन्वये खोट्या विधानाबद्दल शिक्षेचा उल्लेख करा.
- भाषा औपचारिक पण स्पष्ट असावी.`,

    consumer_forum: `तुम्ही जिल्हा ग्राहक विवाद निवारण मंच (District Consumer Disputes Redressal Forum) मध्ये सादर होणारी तक्रार तयार करण्यात तज्ञ आहात.
- Consumer Protection Act, 2019 च्या तरतुदींनुसार तक्रार लिहा.
- "तक्रारदार" आणि "विरुद्ध पक्ष" असे पक्ष-नाम वापरा.
- सेवेतील त्रुटी (deficiency in service) किंवा अनुचित व्यापार प्रथा (unfair trade practice) स्पष्टपणे नमूद करा.
- मागणी (Relief Sought) — नुकसान भरपाई, परतावा, दंड — स्पष्टपणे लिहा.`,

    mahila_cell: `तुम्ही महिला सहाय्यता कक्ष किंवा One Stop Centre मध्ये सादर होणारी तक्रार तयार करण्यात तज्ञ आहात.
- महिलेच्या दृष्टिकोनातून, संवेदनशील भाषेत तक्रार लिहा.
- Protection of Women from Domestic Violence Act, 2005 किंवा IPC/BNS संबंधित कलमे सुचवा.
- तात्काळ संरक्षण / निवारा / पोटगी यांच्या मागणीचा उल्लेख करा जेथे लागू असेल.`,

    rti_officer: `तुम्ही माहितीचा अधिकार अधिनियम, २००५ अंतर्गत RTI अर्ज तयार करण्यात तज्ञ आहात.
- RTI Act 2005 च्या कलम ६(१) अन्वये अर्ज लिहा.
- "जन माहिती अधिकारी" असे संबोधन वापरा.
- माहितीची मागणी अ, ब, क असे क्रमांकित करा — प्रत्येक मुद्दा स्वतंत्र असावा.
- शुल्क, कालमर्यादा (३० दिवस) यांचा उल्लेख करा.
- अर्ज संक्षिप्त, स्पष्ट आणि तथ्य-आधारित ठेवा.`,

    opposite_party: `तुम्ही कायदेशीर नोटीस (Legal Notice) तयार करण्यात तज्ञ आहात.
- "प्रेषक" आणि "प्रति" विभाग स्पष्टपणे लिहा.
- वादाचे स्वरूप, कायदेशीर हक्क आणि मागणी स्पष्टपणे नमूद करा.
- नोटीस कालावधी आणि त्यानंतरच्या कायदेशीर कारवाईची सूचना द्या.
- भाषा ठाम, व्यावसायिक पण अतिआक्रमक नको.`,
  };

  return prompts[authority] ?? prompts["talathi"];
}

// ─── Sub-category specific instructions

function getSubCategoryInstructions(subCategory: string): string {
  const instructions: Record<string, string> = {
    ferfer_aakshep: `हा अर्ज फेरफार नोंदीवर आक्षेप नोंदवण्यासाठी आहे.
- फेरफार क्रमांक, दिनांक, गट नंबर यांचा स्पष्ट उल्लेख करा.
- आक्षेपाची कारणे क्रमांकित स्वरूपात मांडा.
- अर्जदाराचा हक्क / संबंध स्थापित करा.
- "सदर फेरफार नोंद रद्द करण्यात यावी / स्थगित ठेवण्यात यावी" अशी विनंती करा.`,

    varas_nond: `हा अर्ज वारस नोंदणीसाठी आहे.
- मृत धारकाचे नाव, मृत्यू दिनांक, ७/१२ तपशील नमूद करा.
- सर्व वारसांची यादी क्रमांकित करा (नाव व नाते).
- मुस्लिम वारस असल्यास — "Muslim Personal Law (Shariat) Application Act, 1937" चा संदर्भ द्या; "हिस्सा" आणि "निसफ" (½), "रुब" (¼) यासारख्या संज्ञा वापरणे टाळा जोपर्यंत अर्जदाराने सांगितले नाही.
- "सदर वारस नोंद ७/१२ वर नोंदवण्यात यावी" अशी विनंती करा.`,

    vatni: `हा अर्ज जमीन वाटणीसाठी आहे.
- सह-मालकांची नावे, हिस्से, गट नंबर स्पष्टपणे नमूद करा.
- वाटणीचा आधार (वारसा / कोर्ट आदेश / परस्पर संमती) स्पष्ट करा.
- "Maharashtra Land Revenue Code Section ८५ / ८६" चा संदर्भ द्या जेथे लागू असेल.`,

    naav_durusti: `हा अर्ज ७/१२ वरील चुकीच्या नोंदीच्या दुरुस्तीसाठी आहे.
- चुकीची नोंद आणि योग्य नोंद दोन्ही स्पष्टपणे नमूद करा.
- दुरुस्तीचे कारण (लेखनिक चूक / चुकीचा उल्लेख) स्पष्ट करा.
- उपलब्ध पुरावे नमूद करा.`,

    vikri_aakshep: `हा अर्ज जमीन विक्री व्यवहाराला आक्षेप नोंदवण्यासाठी आहे.
- विक्री व्यवहाराचा तपशील, दिनांक, पक्षांची नावे नमूद करा.
- आक्षेपाची कारणे क्रमांकित करा.
- "सदर विक्री व्यवहाराची नोंद स्थगित ठेवण्यात यावी" अशी विनंती करा.`,

    aatkraman: `हा अर्ज जमीन अतिक्रमण दूर करण्यासाठी आहे.
- अतिक्रमणाचे स्वरूप, ठिकाण, दिनांक स्पष्टपणे नमूद करा.
- गट नंबर आणि हद्द तपशील द्या.
- "अतिक्रमण तात्काळ दूर करण्याचे आदेश द्यावेत" अशी विनंती करा.`,

    naav_correction: `हे नाव दुरुस्तीचे प्रतिज्ञापत्र आहे.
- दोन्ही दस्तऐवजांवरील नावे आणि त्यांचे प्रकार स्पष्टपणे नमूद करा.
- "दोन्ही नावे एकाच व्यक्तीची आहेत" हे स्पष्टपणे नमूद करा.
- नावातील फरकाचे कारण (लेखनिक चूक / भाषांतर) नमूद करा.`,

    vaay_correction: `हे वय/DOB दुरुस्तीचे प्रतिज्ञापत्र आहे.
- चुकीची आणि खरी जन्मतारीख दोन्ही स्पष्टपणे नमूद करा.
- कोणत्या दस्तऐवजात चूक आहे ते नमूद करा.`,

    jaat_cert: `हे जात प्रमाणपत्र नाव दुरुस्तीचे प्रतिज्ञापत्र आहे.
- जात प्रमाणपत्रावरील नाव आणि इतर दस्तऐवजांवरील नाव दोन्ही नमूद करा.
- "दोन्ही नावे एकाच व्यक्तीची असून OBC/SC/ST प्रवर्गाचा लाभ घेण्यास पात्र आहे" हे स्पष्टपणे नमूद करा.
- महाविद्यालय प्रवेश / सरकारी नोकरीसाठी उद्देश नमूद करा.`,

    general_affidavit: `हे सामान्य प्रतिज्ञापत्र आहे. दिलेल्या उद्देश आणि विधानांनुसार योग्य प्रतिज्ञापत्र तयार करा.`,

    police_takrar: `ही पोलीस तक्रार आहे.
- घटनाक्रम कालानुक्रमे (date-wise) मांडा.
- आरोपींची ओळख, घटनेची वेळ आणि ठिकाण स्पष्टपणे नमूद करा.
- IPC/BNS कलमे सुचवा: मारहाण (BNS 115), फसवणूक (BNS 316), चोरी (BNS 303), धमकी (BNS 351) — फक्त लागू असतील तेच.
- "सदर आरोपीविरुद्ध गुन्हा नोंदवून कारवाई करण्यात यावी" अशी विनंती करा.`,

    grahak_takrar: `ही ग्राहक तक्रार आहे.
- उत्पादन/सेवेतील त्रुटी (Deficiency in Service) स्पष्टपणे नमूद करा.
- Consumer Protection Act, 2019 Section 35 नुसार तक्रार दाखल होत असल्याचे नमूद करा.
- नुकसान भरपाईची रक्कम स्पष्टपणे मागा.`,

    mahila_takrar: `ही महिला तक्रार आहे.
- DV Act 2005 किंवा BNS संबंधित कलमे लागू असल्यास उल्लेख करा.
- "तात्काळ संरक्षण आदेश (Protection Order) द्यावा" अशी विनंती लागू असल्यास करा.`,

    rti_general: `हा RTI अर्ज आहे.
- RTI Act 2005, Section 6(1) नुसार अर्ज असल्याचे नमूद करा.
- माहितीची मागणी अ, ब, क असे क्रमांकित करा.
- "३० दिवसांच्या आत माहिती द्यावी" अशी विनंती करा.`,

    legal_notice: `ही कायदेशीर नोटीस आहे.
- वादाची पार्श्वभूमी, कायदेशीर हक्क आणि मागणी क्रमांकित करा.
- नोटीस कालावधी उल्लेख करा.
- "अन्यथा न्यायालयीन कारवाई होईल" अशी ताकीद द्या.`,
  };

  return instructions[subCategory] ?? "";
}

// ─── Build the complete system prompt ─────────────────────────────────────────

function buildSystemPrompt(authority: string, subCategory: string): string {
  return `तुम्ही महाराष्ट्र महसूल आणि कायदेशीर दस्तऐवज तयार करण्यात तज्ञ आहात.

${getAuthorityPrompt(authority)}

${getSubCategoryInstructions(subCategory)}

सामान्य नियम:
- फक्त पूर्ण, तयार झालेला दस्तऐवज द्या. कोणतेही स्पष्टीकरण, टीप, प्रस्तावना किंवा "Here is your document" असे काहीही देऊ नका.
- [BLANK] किंवा placeholder कुठेही ठेवू नका — दिलेल्या माहितीवरून संपूर्ण दस्तऐवज तयार करा.
- Generic AI-generated legal text टाळा. प्रत्यक्ष Maharashtra revenue office मध्ये वापरली जाणारी व्यावहारिक भाषा वापरा.
- अतिआत्मविश्वासपूर्ण कायदेशीर निष्कर्ष टाळा — तथ्यांवर आधारित विनंती करा.
- दस्तऐवज फॉर्मेट (शीर्षक, प्रति, विषय, मुख्य भाग, विनंती, स्वाक्षरी विभाग) योग्य असावा.`;
}

// ─── Build the user message ────────────────────────────────────────────────────

function buildUserMessage(req: GenerateRequest): string {
  const fieldLines = Object.entries(req.fields)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  return `खालील माहितीवरून दस्तऐवज तयार करा:

अर्जदाराचे नाव: ${req.applicantName}
अर्जदाराचा पत्ता: ${req.applicantAddress}
दिनांक: ${req.date}

${fieldLines}`;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getSubCategoryLabel(category: string, subCategory: string): string {
  const subs = SUB_CATEGORIES[category] ?? [];
  return subs.find((s) => s.id === subCategory)?.label ?? subCategory;
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "कृपया आधी साइन इन करा." }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: "तुमचे क्रेडिट संपले आहेत." }, { status: 402 });
    }

    const body: GenerateRequest = await req.json();
    const { category, subCategory, authority, applicantName, applicantAddress, date } = body;

    if (!category || !subCategory || !authority || !applicantName || !applicantAddress || !date) {
      return NextResponse.json({ error: "सर्व आवश्यक माहिती भरा." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt(authority, subCategory) },
        { role: "user",   content: buildUserMessage(body) },
      ],
      temperature: 0.25,
      max_tokens: 2000,
    });

    const generatedText = completion.choices[0]?.message?.content ?? "";

    if (!generatedText) {
      return NextResponse.json({ error: "दस्तऐवज तयार करता आला नाही. पुन्हा प्रयत्न करा." }, { status: 500 });
    }

    // Save to database + spend 1 credit atomically
    const title = `${getSubCategoryLabel(category, subCategory)} — ${date}`;
    const saved = await db.$transaction(async (tx) => {
      const updated = await tx.user.updateMany({
        where: { id: session.user.id, credits: { gt: 0 } },
        data: { credits: { decrement: 1 } },
      });

      if (updated.count === 0) return null;

      return tx.document.create({
        data: {
          userId: session.user.id,
          title,
          category,
          subCategory,
          authority,
          content: generatedText,
        },
      });
    });

    if (!saved) {
      return NextResponse.json({ error: "तुमचे क्रेडिट संपले आहेत." }, { status: 402 });
    }

    return NextResponse.json({ document: generatedText, documentId: saved.id });
  } catch (err) {
    console.error("[generate]", err);
    return NextResponse.json({ error: "सर्व्हर त्रुटी. पुन्हा प्रयत्न करा." }, { status: 500 });
  }
}
