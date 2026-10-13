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
    image:
      "https://dbwf8q1mv0cee.cloudfront.net/chi/api/user/dsp/eyjgt1ay3uiurvg0anwqtj6hrt6cwuq50.jpg/110x110cut/?v=1",
    text: "Andrés es muy paciente y sabe lo que hace",
    rating: 5,
  },
  {
    name: "Juliana Amorim",
    role: "Estudiante de Software Engineering",
    company: "España",
    text: "Andrés es un profesor mucho conocimiento y paciencia. Altamente recomendable! Gracias Andrés",
    rating: 5,
    image:
      "https://dbwf8q1mv0cee.cloudfront.net/chi/api/user/dsp/tzzfxeev3ejk84takcrer6c1ll_nz4rw0.jpg/110x110cut/?v=1",
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
  { value: "160+", label: "Clases particulares" },
  { value: "4.9/5", label: "Rating Promedio" },
  { value: "8+", label: "Años de ingeniería" },
  { value: "4", label: "Devs en el equipo MIMS" },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="card-elevated flex h-full flex-col p-6"
      aria-label={`Testimonio de ${testimonial.name}`}
    >
      <blockquote className="mb-6 flex-1 text-base leading-relaxed text-foreground">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-3 border-t border-border pt-5">
        <div className="size-11 shrink-0 overflow-hidden border border-border">
          <img
            src={testimonial.image || "/me.svg"}
            alt=""
            className="size-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </footer>
    </article>
  )
}

export function Testimonials() {
  return (
    <section className="border-y border-border bg-background py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid grid-cols-2 gap-6 md:mb-16 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="mb-2 font-mono text-2xl text-foreground md:text-3xl">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-12 space-y-3 md:mb-14">
          <p className="section-kicker">Testimonios</p>
          <h2 className="section-title">Qué dicen</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
