
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Code2,
  ExternalLink,
  Github,
  Layers3,
  Mail,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import api, { getErrorMessage } from "../api";
import {
  ErrorState,
  Loading,
  Notice,
  Reveal,
} from "../components/Ui";
import { SectionTitle } from "../components/Layout";

// ========================================
// 1. Resource Hook
// ========================================

function useResource(path) {
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: "",
  });

  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    api.get(path)
      .then(({ data }) => {
        if (!active) return;

        const records = Array.isArray(data)
          ? data
          : data?.projects || data?.data || [];

        setState({
          data: records,
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;

        setState({
          data: [],
          loading: false,
          error: getErrorMessage(error),
        });
      });

    return () => {
      active = false;
    };
  }, [path, retry]);

  return {
    ...state,
    reload: () => setRetry((value) => value + 1),
  };
}

// ========================================
// 2. Project Card
// ========================================

function ProjectCard({ project }) {
  return (
    <Reveal>
      <Link
        to={`/projects/${project.slug || project._id}`}
        className="project-card group"
      >
        <div className="project-image">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="project-placeholder">
              <Code2 size={54} />
            </div>
          )}

          <span className="project-open">
            <ArrowUpRight size={20} />
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-xl font-semibold text-white group-hover:text-cyan">
              {project.title}
            </h3>

            <span className="text-xs text-slate-500">
              {project.order
                ? `0${project.order}`
                : "PROJECT"}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-slate-400">
            {project.shortDescription}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {(project.technologies || [])
              .slice(0, 4)
              .map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

// ========================================
// 3. Projects Grid
// ========================================

function ProjectsGrid({
  projects,
  loading,
  error,
  retry,
}) {
  if (loading) {
    return <Loading label="Loading projects..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        retry={retry}
      />
    );
  }

  if (!projects.length) {
    return (
      <div className="glass p-10 text-center text-slate-400">
        Projects are on the way. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
        />
      ))}
    </div>
  );
}

// ========================================
// 4. Home Page
// ========================================

export function Home() {
  const {
    data: projects,
    loading,
    error,
    reload,
  } = useResource("/projects");

  // Featured projects first.
  // If no featured projects exist,
  // show latest published projects.

  const featuredProjects = projects.filter(
    (item) => item.featured === true
  );

  const sortedProjects = [...projects].sort(
    (a, b) =>
      new Date(b.createdAt || 0) -
      new Date(a.createdAt || 0)
  );

  const featured = (
    featuredProjects.length > 0
      ? featuredProjects
      : sortedProjects
  ).slice(0, 3);

  return (
    <div>

      {/* HERO SECTION */}

      <section className="hero-section relative overflow-hidden">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="container relative z-10 grid min-h-[690px] items-center gap-14 py-20 lg:grid-cols-[1.1fr_.9fr]">

          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow flex items-center gap-2"
            >
              <span className="status-dot" />
              OPEN TO FREELANCE OPPORTUNITIES
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl"
            >
              Building digital
              <br />
              experiences that
              <br />
              <span className="gradient-text">
                make a difference.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-7 max-w-xl text-lg leading-8 text-slate-400"
            >
              Hey, I’m{" "}
              <strong className="font-medium text-white">
                Lucky Kumar
              </strong>{" "}
              — a MERN Stack Developer crafting thoughtful,
              high-performance web applications from idea to launch.
            </motion.p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                className="button button-primary"
                to="/projects"
              >
                Explore my work
                <ArrowRight size={17} />
              </Link>

              <Link
                className="button button-ghost"
                to="/contact"
              >
                Get in touch
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="mt-14 flex gap-10 border-t border-white/10 pt-7">
              <div>
                <p className="font-display text-2xl font-semibold text-white">
                  Full-stack
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                  From UI to API
                </p>
              </div>

              <div>
                <p className="font-display text-2xl font-semibold text-white">
                  Always
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                  Learning & building
                </p>
              </div>
            </div>
          </div>

          {/* HERO CODE ANIMATION */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              rotate: 2,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{ duration: 0.8 }}
            className="hero-art-wrap"
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="code-window glass">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                <span className="window-dot bg-rose-400" />
                <span className="window-dot bg-amber-300" />
                <span className="window-dot bg-emerald-400" />

                <span className="ml-auto font-mono text-xs text-slate-500">
                  developer.js
                </span>
              </div>

              <div className="space-y-4 p-7 font-mono text-sm leading-6 sm:p-9">
                <p>
                  <span className="code-purple">const</span>{" "}
                  <span className="code-blue">developer</span> = {"{"}
                </p>

                <p className="pl-5">
                  <span className="code-cyan">name</span>:{" "}
                  <span className="code-green">
                    "Lucky Kumar"
                  </span>,
                </p>

                <p className="pl-5">
                  <span className="code-cyan">role</span>:{" "}
                  <span className="code-green">
                    "MERN Stack Developer"
                  </span>,
                </p>

                <p className="pl-5">
                  <span className="code-cyan">passion</span>: [
                  <span className="code-green">
                    "clean code"
                  </span>,
                </p>

                <p className="pl-16">
                  <span className="code-green">
                    "great experiences"
                  </span>
                  ],
                </p>

                <p className="pl-5">
                  <span className="code-cyan">build</span>: () =&gt; {"{"}
                </p>

                <p className="pl-10">
                  <span className="code-purple">return</span>{" "}
                  <span className="code-blue">impact</span>;
                </p>

                <p className="pl-5">{"}"}</p>
                <p>{"}"};</p>

                <p className="pt-2">
                  <span className="code-purple">await</span>{" "}
                  developer.
                  <span className="code-blue">build</span>();
                  <span className="typing-cursor">_</span>
                </p>
              </div>
            </div>

            <div className="floating-chip chip-one">
              <Braces size={16} />
              JavaScript
            </div>

            <div className="floating-chip chip-two">
              <Sparkles size={16} />
              Creative code
            </div>
          </motion.div>
        </div>

        <a href="#work" className="scroll-cue hidden md:flex">
          <ArrowDown size={15} />
          SCROLL TO EXPLORE
        </a>
      </section>

      {/* SELECTED PROJECTS */}

      <section id="work" className="section-pad">
        <div className="container">
          <SectionTitle
            eyebrow="SELECTED WORK"
            title="A few things I’ve built"
            description="A selection of ideas turned into useful, carefully crafted digital products."
          />

          <ProjectsGrid
            projects={featured}
            loading={loading}
            error={error}
            retry={reload}
          />

          <div className="mt-9 text-center">
            <Link to="/projects" className="text-link">
              View all projects
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}

      <section className="section-pad border-y border-white/5 bg-white/[.015]">
        <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">A LITTLE ABOUT ME</p>

            <h2 className="section-title mt-3">
              Curious by nature.
              <br />
              <span className="gradient-text">
                Developer by choice.
              </span>
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-400">
              I’m a BCA student at IGNOU, a freelance web
              developer, and a lifelong learner. Currently
              sharpening my problem-solving skills with DSA
              in C++ while building full-stack experiences
              with the MERN stack.
            </p>

            <Link to="/about" className="text-link mt-6">
              More about me
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ========================================
// 5. All Projects Page
// ========================================

export function Projects() {
  const {
    data,
    loading,
    error,
    reload,
  } = useResource("/projects");

  const sortedProjects = [...data].sort(
    (a, b) =>
      new Date(b.createdAt || 0) -
      new Date(a.createdAt || 0)
  );

  return (
    <section className="section-pad page-top">
      <div className="container">
        <SectionTitle
          eyebrow="PORTFOLIO"
          title="Projects & experiments"
          description="A growing collection of full-stack applications, creative experiments, and ideas made real."
        />

        <ProjectsGrid
          projects={sortedProjects}
          loading={loading}
          error={error}
          retry={reload}
        />
      </div>
    </section>
  );
}

// ========================================
// 6. Project Details Page
// ========================================

export function ProjectDetails() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);

  const [state, setState] = useState({
    loading: true,
    error: "",
  });

  useEffect(() => {
    let active = true;

    setState({
      loading: true,
      error: "",
    });

    api.get("/projects")
      .then(({ data }) => {
        const records = Array.isArray(data)
          ? data
          : data?.projects || data?.data || [];

        const match = records.find(
          (item) =>
            item.slug === slug ||
            item._id === slug
        );

        if (!active) return;

        setProject(match || null);

        setState({
          loading: false,
          error: match ? "" : "Project not found.",
        });
      })
      .catch((error) => {
        if (!active) return;

        setState({
          loading: false,
          error: getErrorMessage(error),
        });
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (state.loading) {
    return (
      <div className="page-top container">
        <Loading />
      </div>
    );
  }

  if (state.error) {
    return (
      <section className="page-top container">
        <ErrorState message={state.error} />

        <Link to="/projects" className="text-link mt-6">
          Back to projects
          <ArrowRight size={16} />
        </Link>
      </section>
    );
  }

  return (
    <article className="section-pad page-top">
      <div className="container max-w-5xl">
        <Link to="/projects" className="text-link mb-8">
          ← All projects
        </Link>

        <p className="eyebrow mt-7">
          PROJECT SPOTLIGHT
        </p>

        <h1 className="page-title">
          {project.title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
          {project.shortDescription}
        </p>

        {project.image && (
          <img
            className="detail-image mt-10"
            src={project.image}
            alt={project.title}
          />
        )}

        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_260px]">
          <div>
            <h2 className="font-display text-2xl text-white">
              Overview
            </h2>

            <p className="mt-4 whitespace-pre-line leading-8 text-slate-400">
              {project.description}
            </p>
          </div>

          <aside>
            <h3 className="font-display text-lg text-white">
              Built with
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {(project.technologies || []).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3">
              {project.liveUrl && (
                <a
                  className="button button-primary"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live project
                  <ExternalLink size={16} />
                </a>
              )}

              {project.githubUrl && (
                <a
                  className="button button-outline"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={16} />
                  Source code
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

// ========================================
// 7. About Page
// ========================================

export function About() {
  return (
    <section className="section-pad page-top">
      <div className="container">
        <SectionTitle
          eyebrow="ABOUT LUCKY"
          title={
            <>
              Developer, student,
              <br />
              <span className="gradient-text">
                curious human.
              </span>
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_.8fr]">
          <div className="space-y-5 text-lg leading-8 text-slate-400">
            <p>
              I’m Lucky Kumar, a MERN Stack Developer and
              freelance web developer who enjoys turning
              complex problems into clean, intuitive
              digital experiences.
            </p>

            <p>
              I’m currently pursuing my Bachelor of Computer
              Applications at IGNOU. Alongside my coursework,
              I’m learning data structures and algorithms
              with C++ to strengthen the fundamentals
              behind the software I build.
            </p>

            <p>
              My approach is practical and user-focused:
              understand the problem, keep the solution
              maintainable, and sweat the details that make
              a product feel right.
            </p>

            <Link
              to="/contact"
              className="button button-primary mt-3"
            >
              Let’s work together
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="glass p-8">
            <h3 className="font-display text-2xl text-white">
              The journey so far
            </h3>

            <div className="timeline mt-7">
              <div>
                <span className="timeline-dot" />
                <p className="font-medium text-white">
                  Freelance Web Developer
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Designing and building web experiences
                </p>
              </div>

              <div>
                <span className="timeline-dot" />
                <p className="font-medium text-white">
                  BCA · IGNOU
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Building a strong computer science foundation
                </p>
              </div>

              <div>
                <span className="timeline-dot" />
                <p className="font-medium text-white">
                  DSA with C++
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Learning, practicing, and getting sharper
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========================================
// 8. Skills Page
// ========================================

export function Skills() {
  const {
    data,
    loading,
    error,
    reload,
  } = useResource("/skills");

  const grouped = data.reduce((result, skill) => {
    const category = skill.category || "Other";

    (result[category] ||= []).push(skill);

    return result;
  }, {});

  return (
    <section className="section-pad page-top">
      <div className="container">
        <SectionTitle
          eyebrow="MY TOOLKIT"
          title="Skills & technologies"
          description="Technologies I work with to take an idea from first sketch to production."
        />

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} retry={reload} />
        ) : !data.length ? (
          <EmptyContent label="Skills" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(grouped).map(
              ([category, skills]) => (
                <Reveal key={category}>
                  <div className="glass p-7">
                    <h3 className="flex items-center gap-3 font-display text-xl text-white">
                      <Code2 className="text-cyan" size={20} />
                      {category}
                    </h3>

                    <div className="mt-6 space-y-5">
                      {skills.map((skill) => (
                        <div key={skill._id}>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="text-slate-200">
                              {skill.name}
                            </span>

                            <span className="text-slate-500">
                              {skill.proficiency}%
                            </span>
                          </div>

                          <div className="skill-track">
                            <div
                              className="skill-progress"
                              style={{
                                width: `${skill.proficiency}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ========================================
// 9. Services Page
// ========================================

export function Services() {
  const {
    data,
    loading,
    error,
    reload,
  } = useResource("/services");

  return (
    <section className="section-pad page-top">
      <div className="container">
        <SectionTitle
          eyebrow="WHAT I DO"
          title="Services built around your goals"
          description="Flexible freelance development, from a clear starting point to a polished launch."
        />

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} retry={reload} />
        ) : !data.length ? (
          <EmptyContent label="Services" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.map((service, index) => (
              <Reveal key={service._id}>
                <div className="glass service-card h-full p-7">
                  <span className="service-icon">
                    {index === 0 ? (
                      <Layers3 />
                    ) : index === 1 ? (
                      <Code2 />
                    ) : (
                      <Sparkles />
                    )}
                  </span>

                  <h3 className="mt-6 font-display text-xl font-semibold text-white">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ========================================
// 10. Empty Content
// ========================================

function EmptyContent({ label }) {
  return (
    <div className="glass p-10 text-center text-slate-400">
      {label} will appear here once they’ve been added
      in the admin dashboard.
    </div>
  );
}

// ========================================
// 11. Contact Page
// ========================================

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [state, setState] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const update = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  async function submit(event) {
    event.preventDefault();

    setState({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const { data } = await api.post("/contact", form);

      setState({
        loading: false,
        success: data.message || "Message sent successfully!",
        error: "",
      });

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setState({
        loading: false,
        success: "",
        error: getErrorMessage(error),
      });
    }
  }

  return (
    <section className="section-pad page-top">
      <div className="container grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <SectionTitle
            eyebrow="SAY HELLO"
            title={
              <>
                Have a good idea?
                <br />
                <span className="gradient-text">
                  Let’s build it.
                </span>
              </>
            }
            description="Tell me a little about what you’re working on. I’ll get back to you as soon as I can."
          />

          <a
            className="contact-email"
            href="mailto:hello@luckykumar.dev"
          >
            <span className="contact-icon">
              <Mail />
            </span>

            <span>
              <small>EMAIL ME</small>
              <br />
              hello@luckykumar.dev
            </span>

            <ArrowUpRight className="ml-auto" size={18} />
          </a>
        </div>

        <form
          className="glass space-y-5 p-7 sm:p-9"
          onSubmit={submit}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field-label">
              Your name

              <input
                className="field"
                name="name"
                value={form.name}
                onChange={update}
                required
                maxLength={100}
                placeholder="How should I call you?"
              />
            </label>

            <label className="field-label">
              Email address

              <input
                className="field"
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                required
                maxLength={254}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="field-label">
            Subject

            <input
              className="field"
              name="subject"
              value={form.subject}
              onChange={update}
              required
              maxLength={160}
              placeholder="What are you looking to build?"
            />
          </label>

          <label className="field-label">
            Tell me about it

            <textarea
              className="field min-h-36 resize-y"
              name="message"
              value={form.message}
              onChange={update}
              required
              maxLength={5000}
              placeholder="A few details about your project..."
            />
          </label>

          <Notice type="error">
            {state.error}
          </Notice>

          <Notice>
            {state.success}
          </Notice>

          <button
            className="button button-primary"
            disabled={state.loading}
          >
            {state.loading ? "Sending..." : "Send message"}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
