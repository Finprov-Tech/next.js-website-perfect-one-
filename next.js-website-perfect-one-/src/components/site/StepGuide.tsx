import { Headset, MonitorPlay, Mic, Target, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

const steps: { n: string; icon: LucideIcon; title: string; desc: string }[] = [
  { n: "01", icon: Headset, title: "Free Counselling Call", desc: "Talk to a learning advisor about your goals — we'll recommend the right track and mode." },
  { n: "02", icon: MonitorPlay, title: "Hands-On Training", desc: "Learn on the exact software employers use, guided by mentors who still practice in the field." },
  { n: "03", icon: Mic, title: "Interview & Portfolio Prep", desc: "Mock interviews, resume building, and a capstone project you can actually show recruiters." },
  { n: "04", icon: Target, title: "Placement Support", desc: "Our placement cell connects you with hiring partners until you're placed." },
];

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

export function StepGuide() {
  return (
    <section className="py-12">
      <div className={container}>
        <Reveal className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">Your Path to Placement</h2>
          <p className="mt-4 text-lg text-text-body">Four steps from enquiry to your first paycheck.</p>
        </Reveal>
        <StaggerGrid className="relative mt-16 grid gap-8 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-border md:block" />
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem key={s.n}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="btn-gloss grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-navy to-teal text-white shadow-lg shadow-navy/20 transition-transform duration-300 hover:-rotate-6 hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="mt-4 text-xs font-bold uppercase tracking-widest text-teal">Step {s.n}</span>
                  <h3 className="mt-2 text-lg font-bold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-body">{s.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
