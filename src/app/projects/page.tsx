import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "./data";

export default function ProjectsPage() {
  return (
    <>
      <h1 className="font-bold my-12 max-sm:text-center">Projects</h1>
      <section className="space-y-16 pb-20">
        {projects.map((project, index) => (
          <article key={index}>
            <div className="mt-10 flex justify-between flex-col gap-4 sm:items-center sm:flex-row">
              <h2 className="m-0 normal-case">{project.title}</h2>
              <div className="flex items-center gap-4 flex-wrap">
                {project.techs.map((tech, techIndex) => (
                  <div key={techIndex} className="ring-1 ring-zinc-950 dark:ring-zinc-300 px-2 py-1">
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            {project.image &&
              (project.hasAnchorOnImage && (project.live || project.source) ? (
                <a
                  href={project.live ?? project.source}
                  target="_blank"
                  className="group block overflow-hidden my-6 relative ring-1 ring-zinc-950"
                  rel="noreferrer"
                >
                  <span className="z-10 absolute flex items-center transition-all gap-2 top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-100">
                    Clique para visitar <ArrowUpRight className="size-5" />
                  </span>
                  <Image
                    className="size-full group-hover:scale-105 transition-all"
                    src={project.image || "/placeholder.svg"}
                    width={9999}
                    height={250}
                    alt={`Screenshot of ${project.title}`}
                  />
                </a>
              ) : (
                <div className="block overflow-hidden my-6 relative ring-1 ring-zinc-950">
                  <Image
                    className="size-full"
                    src={project.image || "/placeholder.svg"}
                    width={9999}
                    height={250}
                    alt={`Screenshot of ${project.title}`}
                  />
                </div>
              ))}

            <p>{project.description}</p>

            <div className="items-center flex gap-4 mt-4">
              {project.live && (
                <a className="items-center flex gap-2" href={project.live} target="_blank" rel="noreferrer">
                  Visite o site
                  <ArrowUpRight className="size-5" />
                </a>
              )}
              <a className="items-center flex gap-2" href={project.source} target="_blank" rel="noreferrer">
                Visite o código
                <ArrowUpRight className="size-5" />
              </a>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
