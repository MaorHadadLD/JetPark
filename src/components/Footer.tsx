import Image from "next/image";
import { site } from "@/config/site";
import { clip, photos } from "@/lib/photos";

export function Footer() {
  const { phone, email, whatsapp } = site.contact;
  const credits = [...Object.values(photos), clip];
  const hasContact = Boolean(phone || email || whatsapp);

  return (
    <footer className="site-footer" aria-labelledby="footer-title">
      <Image
        src={photos.highway.src}
        alt={photos.highway.alt}
        fill
        sizes="100vw"
        className="footer-photo"
        style={{ objectFit: "cover", objectPosition: photos.highway.position }}
      />
      <div className="footer-top frame">
        <nav aria-label="ניווט בתחתית העמוד">
          <ul>
            <li>
              <a className="text-link" href="#route">
                איך זה עובד
              </a>
            </li>
            <li>
              <a className="text-link" href="#modes">
                ממריאים וחוזרים
              </a>
            </li>
            <li>
              <a className="text-link" href="#booking">
                תיאום
              </a>
            </li>
            <li>
              <a className="text-link" href="#questions">
                שאלות
              </a>
            </li>
          </ul>
        </nav>
        <div className="footer-contact">
          <p className="footer-line">החופשה מתחילה בטרמינל. אנחנו ממשיכים עם הרכב.</p>
          {hasContact ? (
            <ul>
              {phone ? (
                <li>
                  <a className="text-link num" href={`tel:+${phone}`} dir="ltr">
                    +{phone}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a className="text-link" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a className="text-link" href={`mailto:${email}`}>
                    {email}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="footer-bottom frame">
        <h2 id="footer-title" className="footer-mark display" dir="ltr">
          JetPark
        </h2>
        <div className="footer-credits">
          <h3>צילומים ווידאו</h3>
          <ul dir="ltr" lang="en">
            {credits.map((p) => (
              <li key={p.credit.page}>
                <a className="text-link" href={p.credit.page} target="_blank" rel="noreferrer">
                  {p.credit.title}
                </a>
                {" — "}
                {p.credit.creator},{" "}
                <a className="text-link" href={p.credit.licenseUrl} target="_blank" rel="noreferrer">
                  {p.credit.license}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="footer-legal">© {new Date().getFullYear()} JetPark</p>
      </div>
    </footer>
  );
}
