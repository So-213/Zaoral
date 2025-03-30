const links = [
    { href: "/zaoral", label: "Zaoralとは" },
    { href: "/howToUse", label: "使い方" },
    { href: "/fromAuthor", label: "サイト制作者より" },
]
  
export default function NavLinkSection() {
return (
    <>
    {links.map(({ href, label }) => (
        <section className="max-w-4xl mx-auto" key={href}>
        <div className="group relative w-fit mx-auto">
            <a
            href={href}
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg md:text-xl font-bold text-black hover:text-rose-500 transition-all"
            >
            <span>{label}</span>
            </a>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-rose-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
        </section>
    ))}
    </>
)
}
  