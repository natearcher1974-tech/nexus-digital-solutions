import { notes } from "@/data/site";

export function FieldNotes() {
  return (
    <section id="notes" className="scroll-mt-24 border-t border-line">
      <figure>
        <img
          src="/images/lumen.jpg"
          alt="Garden roof in warm light, solar set among planting"
          width={1600}
          height={1200}
          className="aspect-[16/7] max-h-[32rem] w-full object-cover"
        />
      </figure>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Field notes</p>
        <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight font-medium sm:text-5xl">
          The work is easier to recognize in a room than in a release note.
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Composite notes from the kinds of places we design for. Not a client list, and not a claim
          that these sites are already live.
        </p>
        <div className="mt-12">
          {notes.map((note) => (
            <article key={note.place} className="grid gap-3 border-t border-line py-8 md:grid-cols-12">
              <h3 className="font-serif text-2xl font-medium md:col-span-4">{note.place}</h3>
              <div className="md:col-span-7">
                <p className="text-xs font-medium tracking-widest text-leaf uppercase">{note.system}</p>
                <p className="mt-3 text-muted">{note.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
