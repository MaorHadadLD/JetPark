import Image from "next/image";
import { photos } from "@/lib/photos";
import { rateLine } from "@/lib/pricing";

const FACTS = [
  "שני מפגשים, בטרמינל 1 או בטרמינל 3 בנתב״ג.",
  "לפני הטיסה: מוסרים את הרכב לנציג JetPark.",
  "אחרי החזרה: מקבלים את הרכב בחזרה.",
];

const QUESTIONS = [
  {
    q: "מה בדיוק JetPark עושה?",
    a: "נציג JetPark מקבל מכם את הרכב בטרמינל לפני הטיסה, ומחזיר לכם אותו בטרמינל כשאתם חוזרים. אתם לא צריכים לחפש חניה לפני הטיסה.",
  },
  {
    q: "באילו טרמינלים השירות פועל?",
    a: "בטרמינל 1 ובטרמינל 3 בנמל התעופה בן גוריון. בכרטיס התיאום בוחרים טרמינל למסירה וטרמינל לקבלה.",
  },
  {
    q: "כמה זה עולה?",
    a: `${rateLine(". ")}. כל 24 שעות שהתחילו, מהמסירה ועד הקבלה, נספרות כיום. כרטיס התיאום מחשב את המחיר לפי המועדים שבחרתם.`,
  },
  {
    q: "האם כרטיס התיאום הוא הזמנה?",
    a: "לא. הכרטיס מסכם את המועדים שבחרתם לבקשת תיאום. זו אינה הזמנה מאושרת, והמועדים עדיין לא אושרו.",
  },
  {
    q: "מה צריך כדי לבקש תיאום?",
    a: "תאריך, שעה וטרמינל (1 או 3) שבהם תרצו למסור את הרכב, ותאריך, שעה וטרמינל שבהם תרצו לקבל אותו בחזרה.",
  },
  {
    q: "איך שומרים את פרטי הבקשה?",
    a: "אחרי שבחרתם מועדים, לחצו על ״העתקת פרטי הבקשה״ בכרטיס התיאום. הפרטים מועתקים כטקסט מסודר שאפשר להדביק בכל הודעה.",
  },
];

export function Questions() {
  return (
    <section id="questions" className="questions frame" aria-labelledby="questions-title">
      <div className="questions-copy">
        <h2 id="questions-title" className="display questions-title" data-reveal>
          לפני שמתאמים.
        </h2>
        <ul className="questions-facts">
          {FACTS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="questions-list">
          {QUESTIONS.map(({ q, a }) => (
            <details key={q} className="question">
              <summary>
                <span>{q}</span>
                <svg className="chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="answer">
                <p>{a}</p>
              </div>
            </details>
          ))}
        </div>
        <a href="#booking" className="btn btn-primary questions-cta">
          לכרטיס התיאום
        </a>
      </div>

      <div className="questions-media" aria-hidden="false">
        <div className="questions-tall" data-reveal="mask">
          <Image
            src={photos.jetbridgeSun.src}
            alt={photos.jetbridgeSun.alt}
            fill
            sizes="(max-width: 860px) 100vw, 45vw"
            style={{ objectFit: "cover", objectPosition: photos.jetbridgeSun.position }}
          />
        </div>
        <div className="questions-square" data-reveal="mask" style={{ ["--i" as string]: 2 }}>
          <Image
            src={photos.coastRock.src}
            alt={photos.coastRock.alt}
            fill
            sizes="(max-width: 860px) 40vw, 16vw"
            style={{ objectFit: "cover", objectPosition: photos.coastRock.position }}
          />
        </div>
      </div>
    </section>
  );
}
