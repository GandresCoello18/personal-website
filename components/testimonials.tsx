import { Quote } from "lucide-react"

interface Testimonial {
  name: string
  role: string
  company: string
  image: string
  text: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: "Alberto Flores Conejo",
    role: "Estudiante de Desarrollo web",
    company: "España",
    image: "https://dbwf8q1mv0cee.cloudfront.net/chi/api/user/dsp/eyjgt1ay3uiurvg0anwqtj6hrt6cwuq50.jpg/110x110cut/?v=1",
    text: "Andrés es muy paciente y sabe lo que hace",
    rating: 5,
  },
  {
    name: "Juliana Amorim",
    role: "Estudiante de Software Engineering",
    company: "España",
    text: "Andrés es un profesor mucho conocimiento y paciencia. Altamente recomendable! Gracias Andrés",
    rating: 5,
    image: "https://dbwf8q1mv0cee.cloudfront.net/chi/api/user/dsp/tzzfxeev3ejk84takcrer6c1ll_nz4rw0.jpg/110x110cut/?v=1",
  },
  {
    name: "Clara Foscaldi",
    role: "Frontend Vue.js Developer",
    company: "Argentina",
    image: "https://d2d74a7s2nfnwy.cloudfront.net/i/avatar4.png?v=1",
    text: "Excelente profesor!! Es muy dedicado y enseña con mucha paciencia. Además de que tiene buena disposición y muestra compromiso hacia sus alumnos.",
    rating: 5,
  },
  {
    name: "Felipe Stevenson Fernandez",
    role: "Practicante de Backend",
    company: "Chile",
    image: "https://d2d74a7s2nfnwy.cloudfront.net/i/avatar4.png?v=1",
    text: "Comprometido con lo que se le pide ayuda, explica muy bien, paso por paso",
    rating: 5,
  },
  {
    name: "Pedro",
    role: "Junior Developer",
    company: "Colombia",
    image: "https://d2d74a7s2nfnwy.cloudfront.net/i/avatar4.png?v=1",
    text: "Lo recomiendo muchísimo, se adaptó totalmente a mi situación, fué paciente y logré sobradamente lo que buscaba.",
    rating: 5,
  },
  {
    name: "Isabel fernandez",
    role: "Estudiante con proyecto final",
    company: "Republica Dominicana",
    image: "https://d2d74a7s2nfnwy.cloudfront.net/i/avatar4.png?v=1",
    text: "Buen profesor, se preocupa por revisar la materia para que todo quede claro.",
    rating: 5,
  },
]

const stats = [
  { value: "150+", label: "Estudiantes Satisfechos" },
  { value: "4.9/5", label: "Rating Promedio" },
  { value: "100%", label: "Tasa de Recomendación" },
  { value: "5+", label: "Años de Experiencia" },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="flex h-full w-[min(100vw-2rem,22rem)] shrink-0 flex-col rounded-xl border border-border bg-card p-6 shadow-md sm:w-[24rem] sm:p-8 md:w-[26rem]"
      aria-label={`Testimonio de ${testimonial.name}`}
    >
      <Quote className="mb-4 size-9 text-foreground/90 sm:size-10" strokeWidth={1.25} aria-hidden />

      <blockquote className="mb-6 flex-1 text-base italic leading-relaxed text-foreground sm:text-lg">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>

      <footer className="flex items-center gap-3 border-t border-border pt-5">
        <div className="size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-border/80">
          <img
            src={testimonial.image || "/me.svg"}
            alt=""
            className="size-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </footer>
    </article>
  )
}

export function Testimonials() {
  const loop = [...testimonials, ...testimonials]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid grid-cols-2 gap-6 md:mb-16 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="mb-2 text-3xl font-bold text-accent md:text-4xl">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-12 space-y-3 text-center md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Testimonios</p>
          <h2 className="section-title">Qué dicen</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Historias de desarrolladores que transformaron su carrera gracias a mentoría y educación de calidad
          </p>
        </div>
      </div>

      <div className="testimonial-marquee-mask relative w-full overflow-hidden py-2">
        <div className="testimonial-marquee-track">
          {loop.map((testimonial, idx) => (
            <TestimonialCard key={`${testimonial.name}-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
