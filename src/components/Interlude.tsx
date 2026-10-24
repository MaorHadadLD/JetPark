import Image from "next/image";
import { LoopVideo } from "./LoopVideo";
import { clip, photos } from "@/lib/photos";

const PANELS = [
  { photo: photos.jetbridge, grow: 5, caption: "הטרמינל" },
  { photo: null, grow: 2, caption: "הטיסה" },
  { photo: photos.coast, grow: 3, caption: "החופשה" },
  { photo: photos.road, grow: 2, caption: "הדרך הביתה" },
] as const;

/** A quiet band between the two loud moments: the whole trip in four slices. */
export function Interlude() {
  return (
    <section className="interlude" aria-labelledby="interlude-title">
      <div className="frame interlude-head">
        <h2 id="interlude-title" className="display interlude-title" data-reveal>
          החופשה מתחילה בטרמינל.
        </h2>
        <p className="interlude-lead" data-reveal style={{ ["--i" as string]: 1 }}>
          מסרתם את המפתח לנציג בטרמינל, ומשם אתם ממשיכים ישר לטיסה. את הרכב תקבלו בחזרה בטרמינל, כשתחזרו.
        </p>
      </div>
      <div className="band" data-reveal="mask">
        {PANELS.map(({ photo, grow, caption }, i) => (
          <figure key={caption} className="band-panel" aria-label={caption} style={{ ["--grow" as string]: grow }}>
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={i === 0 ? "(max-width: 760px) 64vw, 42vw" : "(max-width: 760px) 36vw, 25vw"}
                style={{ objectFit: "cover", objectPosition: photo.position }}
              />
            ) : (
              <LoopVideo src={clip.src} poster={clip.poster} label={clip.alt} />
            )}
            {i === 0 ? (
              <p className="band-title display">
                אנחנו ממשיכים
                <br />
                עם הרכב.
              </p>
            ) : null}
          </figure>
        ))}
      </div>
      <p className="frame band-caption">{PANELS.map((p) => p.caption).join(" · ")}</p>
    </section>
  );
}
