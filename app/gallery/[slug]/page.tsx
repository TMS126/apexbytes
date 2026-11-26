import { ProjectPageMedia } from "@/components/gallery/project-page-media"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PROJECTS } from "@/lib/data"
import { CLIENT_TYPE_LABEL, buildInquireHref } from "@/lib/gallery-helpers"
import { pageMetadata } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = PROJECTS.find((item) => item.id === slug)
  return project ? pageMetadata({ title: project.title, description: project.shortDesc, path: `/gallery/${project.id}`, image: project.image }) : {}
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = PROJECTS.find((item) => item.id === slug)
  if (!project) notFound()
  const siblings = PROJECTS.filter((item) => item.hub === project.hub && item.id !== project.id)
  return <div className="min-h-screen bg-background"><Navbar /><main id="main-content" className="mx-auto max-w-6xl px-5 pb-24 pt-[calc(var(--nav-h)+2rem)] md:px-8">
    <Link href="/gallery" className="text-sm font-semibold text-muted-foreground hover:text-foreground">← Back to portfolio</Link>
    <header className="mt-8 max-w-3xl"><p className="abh-eyebrow">{project.tag} · {CLIENT_TYPE_LABEL[project.clientType]}</p><h1 className="abh-page-title mt-3">{project.title}</h1><p className="mt-4 text-lg text-muted-foreground">{project.shortDesc}</p></header>
    <ProjectPageMedia id={project.id} title={project.title} images={project.images} />
    <div className="mt-12 grid gap-10 md:grid-cols-2"><section><h2 className="text-2xl font-semibold">About the project</h2><p className="mt-3 leading-relaxed text-muted-foreground">{project.clientGoal}</p></section><section><h2 className="text-2xl font-semibold">What we did</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">{project.whatWeDid.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h2 className="text-2xl font-semibold">Tools and format</h2><p className="mt-3 text-muted-foreground">{project.tools.join(" · ")}</p></section><section><h2 className="text-2xl font-semibold">Project outcome</h2><p className="mt-3 leading-relaxed text-muted-foreground">{project.result}</p></section></div>
    <Link href={buildInquireHref(project)} className="abh-btn-primary mt-10 inline-flex rounded-full px-6 py-3 font-semibold">Enquire about a similar project</Link>
    {siblings.length > 0 && <section className="mt-16"><h2 className="text-2xl font-semibold">More from {project.tag}</h2><div className="mt-5 flex flex-wrap gap-4">{siblings.map((item) => <Link key={item.id} href={`/gallery/${item.id}`} className="underline underline-offset-4">{item.title}</Link>)}</div></section>}
  </main><Footer /></div>
}
