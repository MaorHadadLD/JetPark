/**
 * Atmosphere photographs. None of them shows JetPark's people, lot or cars,
 * and none is a specific terminal JetPark serves. Every one is credited in the
 * footer; sources and licences are also listed in public/photos/CREDITS.md.
 */
export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
  credit: { title: string; creator: string; license: string; licenseUrl: string; page: string };
};

export const photos = {
  hero: {
    src: "/photos/hero-terminal-3.jpg",
    alt: "טרמינל 3 בנמל התעופה בן גוריון, עם מגדל הפיקוח ודגלי ישראל בכניסה",
    width: 2560,
    height: 1920,
    position: "40% 55%",
    credit: {
      title: "Israel Ben Gurion Airport terminal 3 closeup",
      creator: "Djampa",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      page: "https://commons.wikimedia.org/wiki/File:Israel_Ben_Gurion_Airport_terminal_3_closeup.jpg",
    },
  },
  apron: {
    src: "/photos/apron-dusk.jpg",
    alt: "רחבת מטוסים בשקיעה, נשקפת מגג טרמינל",
    width: 1920,
    height: 1440,
    position: "50% 40%",
    credit: {
      title: "CDG airport terminal 2 at dusk 10",
      creator: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      page: "https://commons.wikimedia.org/wiki/File:CDG_airport_terminal_2_at_dusk_10.jpg",
    },
  },
  jetbridge: {
    src: "/photos/jetbridge-dusk.jpg",
    alt: "שרוולי עלייה למטוס ורחבת שירות בטרמינל, בערב",
    width: 1920,
    height: 1440,
    position: "60% 50%",
    credit: {
      title: "CDG airport terminal 2 at dusk 5",
      creator: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      page: "https://commons.wikimedia.org/wiki/File:CDG_airport_terminal_2_at_dusk_5.jpg",
    },
  },
  jetbridgeSun: {
    src: "/photos/jetbridge-sun.jpg",
    alt: "שמש נמוכה בין שרוולי העלייה למטוס",
    width: 1920,
    height: 1440,
    position: "45% 50%",
    credit: {
      title: "CDG airport terminal 2 at dusk 6",
      creator: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      page: "https://commons.wikimedia.org/wiki/File:CDG_airport_terminal_2_at_dusk_6.jpg",
    },
  },
  coast: {
    src: "/photos/coast-dusk.jpg",
    alt: "סוכת מציל ריקה על חוף, בשעת בין ערביים",
    width: 2400,
    height: 1600,
    position: "32% 50%",
    credit: {
      title: "Lifeguard chair at dusk",
      creator: "Fré Sonneveld",
      license: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      page: "https://unsplash.com/photos/2qLT_Rq-2tk",
    },
  },
  coastRock: {
    src: "/photos/coast-rock.jpg",
    alt: "סלע בודד בים כחול תחת שמיים ורודים",
    width: 1600,
    height: 1600,
    position: "70% 60%",
    credit: {
      title: "Rock in a calm sea",
      creator: "Stephen Radford",
      license: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      page: "https://unsplash.com/photos/674bDNKmnIk",
    },
  },
  road: {
    src: "/photos/road-light-trails.jpg",
    alt: "כביש מואר בלילה ופסי אור של מכוניות",
    width: 1920,
    height: 1200,
    position: "45% 60%",
    credit: {
      title: "Highway light trails at night",
      creator: "Jamie Street",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      page: "https://commons.wikimedia.org/wiki/File:Highway_light_trains_at_night_(Unsplash).jpg",
    },
  },
  wingTakeoff: {
    src: "/photos/wing-takeoff.jpg",
    alt: "כנף מטוס על רקע שמיים ורודים, רגע לפני ההמראה",
    width: 1920,
    height: 1920,
    position: "50% 55%",
    credit: {
      title: "Milan Takeoff during Covid19",
      creator: "Ekin Saygi Tsantis",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      page: "https://commons.wikimedia.org/wiki/File:Milan_Takeoff_during_Covid19.jpg",
    },
  },
  wingLanding: {
    src: "/photos/wing-landing.jpg",
    alt: "כנף מטוס מעל ים של עננים באור ערב, לקראת נחיתה",
    width: 1920,
    height: 2560,
    position: "60% 55%",
    credit: {
      title: "Evening mood shortly before landing at Munich Airport",
      creator: "Thomas Woodtli",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0",
      page: "https://commons.wikimedia.org/wiki/File:Evening_mood_shortly_before_landing_at_Munich_Airport_on_the_flight_from_Dresden_(8500484091).jpg",
    },
  },
  sky: {
    src: "/photos/sky-takeoff.jpg",
    alt: "שמיים ורודים בשקיעה ומטוס קטן ממריא באופק",
    width: 1920,
    height: 1280,
    position: "60% 40%",
    credit: {
      title: "Rosy Sunset for Takeoff at Detroit",
      creator: "formulanone",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
      page: "https://commons.wikimedia.org/wiki/File:Rosy_Sunset_for_Takeoff_at_Detroit_(49173577872).jpg",
    },
  },
  highway: {
    src: "/photos/highway-blue-hour.jpg",
    alt: "כביש מהיר בשעה הכחולה, פסי אור לבנים ואדומים",
    width: 1920,
    height: 1280,
    position: "50% 55%",
    credit: {
      title: "Light Trails On The Highway",
      creator: "Makia Minich",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
      page: "https://commons.wikimedia.org/wiki/File:Light_Trails_On_The_Highway_(60829112).jpeg",
    },
  },
} satisfies Record<string, Photo>;

export const clip = {
  src: "/video/clouds-window.webm",
  poster: "/video/clouds-window-poster.jpg",
  alt: "מבט מחלון מטוס: כנף מעל שכבת עננים",
  credit: {
    title: "Clouds from Airplane Window 1",
    creator: "F ASTILY",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Clouds_from_Airplane_Window_1_2016-08-29.webm",
  },
};
