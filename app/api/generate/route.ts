import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type DocType = "arj" | "pratidnyapatr" | "rti" | "takrar" | "notice" | "other";

interface GenerateRequest {
  docType: DocType;
  applicantName: string;
  applicantAddress: string;
  recipientName: string;
  recipientDesignation: string;
  subject: string;
  situation: string;
  date: string;
}

function getSystemPrompt(docType: DocType): string {
  const base = `तुम्ही एक तज्ञ मराठी कायदेशीर लेखक आहात जे महाराष्ट्र न्यायालयात सादर होणारे दस्तऐवज तयार करता.
नियम:
- फक्त पूर्ण, तयार झालेला दस्तऐवज द्या. कोणतेही स्पष्टीकरण, टीप किंवा प्रस्तावना देऊ नका.
- शीर्षक, पत्ता, विषय, मुख्य भाग आणि स्वाक्षरी विभाग — सर्व योग्य फॉर्मेटमध्ये असावेत.
- भाषा औपचारिक मराठी असावी. आवश्यक तेथे कायदेशीर शब्दावली वापरा.
- अर्जदाराने दिलेली परिस्थिती स्पष्ट, सुटसुटीत मराठीत मांडा.
- [BLANK] असे placeholder कुठेही ठेवू नका — दिलेल्या माहितीवरून संपूर्ण दस्तऐवज तयार करा.`;

  const templates: Record<DocType, string> = {
    arj: `${base}

तुम्ही एक सामान्य अर्ज (General Application/Petition) तयार करायचा आहे.
फॉर्मेट असा असावा:

                    [न्यायालयाचे/कार्यालयाचे नाव]
                    [न्यायाधीश/अधिकाऱ्याचे पद]

                              अर्ज

प्रति,
मा. [पद] साहेब,
[न्यायालयाचे/कार्यालयाचे नाव]

विषय: [subject]

महोदय/महोदया,

      सविनय निवेदन असे की, [body - 3 to 4 paragraphs based on situation]

      तरी आपणास विनंती आहे की, [specific prayer/request based on situation]

                                        आपला/आपली विश्वासू,
                                        [अर्जदाराचे नाव]
                                        [अर्जदाराचा पत्ता]

दिनांक: [date]`,

    pratidnyapatr: `${base}

तुम्ही एक प्रतिज्ञापत्र (Affidavit) तयार करायचे आहे.
फॉर्मेट असा असावा:

                    प्रतिज्ञापत्र
                    (Affidavit)

मी, [नाव], वय [अंदाजे वय if available else "प्रौढ"] वर्षे, राहणार [address],
धर्म [धर्म if available], व्यवसाय [व्यवसाय if available],
हे शपथेवर सांगतो/सांगते की —

१. [statement based on situation]
२. [statement]
३. [statement]
(as many as needed)

वरील सर्व विधाने मला माहीत असलेल्या तथ्यांवर आधारित असून सत्य आहेत.
कोणतेही विधान खोटे आढळल्यास मला भारतीय दंड संहिता कलम १९३ अन्वये
शिक्षा होण्यास मी पात्र आहे याची मला पूर्ण जाणीव आहे.

                              शपथकर्त्याची सही
                              [नाव]
                              [पत्ता]

दिनांक: [date]
ठिकाण: [city from address]

नोटरी/न्यायदंडाधिकारी यांच्यासमोर शपथ घेतली.

_______________________
नोटरी/न्यायदंडाधिकारी
शिक्का व स्वाक्षरी`,

    rti: `${base}

तुम्ही माहितीचा अधिकार अधिनियम, २००५ अंतर्गत RTI अर्ज तयार करायचा आहे.
फॉर्मेट असा असावा:

प्रति,
श्री/श्रीमती [जन माहिती अधिकाऱ्याचे नाव किंवा "जन माहिती अधिकारी"],
[विभाग/कार्यालयाचे नाव],
[पत्ता]

विषय: माहितीचा अधिकार अधिनियम, २००५ च्या कलम ६(१) अन्वये माहिती मागणीचा अर्ज.

संदर्भ: माहितीचा अधिकार अधिनियम, २००५.

महोदय/महोदया,

      मी [नाव], रा. [पत्ता], यांना खालील माहिती हवी आहे:

      अ) [specific information request based on situation]
      ब) [additional request if needed]
      क) [additional request if needed]

      सदर माहिती शक्य तितक्या लवकर, परंतु अधिनियमातील तरतुदींनुसार
      ३० दिवसांच्या आत द्यावी अशी विनंती आहे.

      माहितीचा अधिकार अधिनियम, २००५ च्या कलम ७(३) नुसार रुपये १०/- (दहा रुपये)
      इतके शुल्क रोख/डिमांड ड्राफ्ट/IPO द्वारे सोबत सादर केले आहे.

                                        अर्जदार,
                                        [नाव]
                                        [पत्ता]
                                        दूरध्वनी: [if available]

दिनांक: [date]`,

    takrar: `${base}

तुम्ही एक तक्रार अर्ज (Complaint) तयार करायचा आहे.
हे पोलीस ठाण्यात किंवा संबंधित अधिकाऱ्याकडे सादर होणारे असेल.
फॉर्मेट असा असावा:

प्रति,
मान्यवर [पद],
[कार्यालय/पोलीस ठाणे]

विषय: [subject - तक्रारीचा थोडक्यात आशय]

महोदय/महोदया,

      मी [नाव], रा. [पत्ता], हा/ही तक्रारदार आहे/आहे. खालील बाबींबाबत
      आपल्याकडे तक्रार नोंदविण्यासाठी हा अर्ज सादर करत आहे/आहे.

      घटनेचा तपशील:
      [detailed incident description based on situation - 2 to 3 paragraphs]

      आरोपी/जबाबदार व्यक्ती: [if mentioned in situation, else omit]

      दिनांक व वेळ: [if mentioned, else use provided date]

      या घटनेमुळे मला/आम्हाला [specify the harm/loss] झाले/झाली आहे.

      तरी आपणास विनंती आहे की, सदर प्रकरणी तातडीने चौकशी करून
      योग्य ती कायदेशीर कार्यवाही करण्यात यावी.

                                        तक्रारदार,
                                        [नाव]
                                        [पत्ता]
                                        दूरध्वनी: [if available]

दिनांक: [date]`,

    notice: `${base}

तुम्ही एक कायदेशीर नोटीस (Legal Notice) तयार करायची आहे.
फॉर्मेट असा असावा:

                    कायदेशीर नोटीस
                    (Legal Notice)

दिनांक: [date]

प्रति:
[प्राप्तकर्त्याचे नाव]
[प्राप्तकर्त्याचा पत्ता]

प्रेषक:
[अर्जदाराचे नाव]
[अर्जदाराचा पत्ता]

विषय: [subject]

नोटीस:

      माझ्या अशिलाने [or "मी"], [नाव], रा. [पत्ता], यांच्यातर्फे
      आपणास खालील बाबी निदर्शनास आणून देण्यात येत आहेत:

      १. [situation/dispute background]
      २. [legal rights violated]
      ३. [demand/remedy sought]

      तरी आपणास या नोटिसीद्वारे सूचित करण्यात येते की, या नोटिसीच्या
      प्राप्तीपासून १५ (पंधरा) दिवसांच्या आत [specific action demanded],
      अन्यथा आपल्याविरुद्ध सक्षम न्यायालयात दावा/तक्रार दाखल करण्यात
      येईल, त्याचा सर्व खर्च आपणास द्यावा लागेल याची नोंद घ्यावी.

                                        [अर्जदाराचे नाव]
                                        [पत्ता]`,

    other: `${base}

तुम्ही एक सामान्य कायदेशीर दस्तऐवज तयार करायचा आहे.
परिस्थितीनुसार योग्य फॉर्मेट निवडा आणि संपूर्ण, व्यावसायिक दस्तऐवज तयार करा.
प्रमाणित मराठी कायदेशीर भाषा वापरा. योग्य शीर्षक, प्रति, विषय, मुख्य भाग आणि स्वाक्षरी विभाग असावा.`,
  };

  return templates[docType];
}

function getUserPrompt(data: GenerateRequest): string {
  return `खालील माहितीवरून ${data.docType === "pratidnyapatr" ? "प्रतिज्ञापत्र" : "दस्तऐवज"} तयार करा:

अर्जदाराचे नाव: ${data.applicantName}
अर्जदाराचा पत्ता: ${data.applicantAddress}
प्राप्तकर्ता: ${data.recipientName}${data.recipientDesignation ? ` (${data.recipientDesignation})` : ""}
विषय: ${data.subject}
दिनांक: ${data.date}

परिस्थिती / विनंती:
${data.situation}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    const { docType, applicantName, applicantAddress, recipientName, subject, situation, date } = body;

    if (!docType || !applicantName || !applicantAddress || !recipientName || !subject || !situation || !date) {
      return NextResponse.json({ error: "सर्व आवश्यक माहिती भरा." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: getSystemPrompt(docType) },
        { role: "user", content: getUserPrompt(body) },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const generatedText = completion.choices[0]?.message?.content ?? "";

    if (!generatedText) {
      return NextResponse.json({ error: "दस्तऐवज तयार करता आला नाही. पुन्हा प्रयत्न करा." }, { status: 500 });
    }

    return NextResponse.json({ document: generatedText });
  } catch (err) {
    console.error("[generate]", err);
    return NextResponse.json({ error: "सर्व्हर त्रुटी. पुन्हा प्रयत्न करा." }, { status: 500 });
  }
}
