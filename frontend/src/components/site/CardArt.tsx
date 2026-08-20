import { getCourseBySlug } from "@/data/courses";
import analytics from "@/assets/course-images/pgdifa.png";
import pgbat from "@/assets/course-images/pgbat.png";
import dia from "@/assets/course-images/dia.png";
import cbat from "@/assets/course-images/cbat.png";
import sapFi from "@/assets/course-images/sap-fi.png";
import tally from "@/assets/course-images/tally-gst.png";
import gulf from "@/assets/course-images/gulf-accounting.png";
import ibap from "@/assets/course-images/ibap.png";
import digital from "@/assets/course-images/digital-marketing.png";
import seo from "@/assets/course-images/seo-ppc.png";
import danalytics from "@/assets/course-images/data-analytics.png";
import basp from "@/assets/course-images/basp.png";

interface CourseCardArtProps {
  slug: string;
  image?: string;
  alt?: string;
  className?: string;
}

export default function CourseCardArt({ slug, image: propImage, alt, className }: CourseCardArtProps) {
  const course = getCourseBySlug(slug);
  const rawImage = propImage || course?.image || tally;
  const imgSrc = typeof rawImage === "string" ? rawImage : (rawImage as any)?.src;

  return (
    <div className={className || "h-36 overflow-hidden rounded-xl bg-navy/5"}>
      <img
        src={imgSrc}
        alt={alt || course?.title || "Course thumbnail"}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}
