const commitments = [
  {
    index: "01",
    title: "Health",
    body: "Bodies notice bad air, broken sleep, and a missed visit long before a dashboard does. Those are the signals that matter. Earlier warning. Fewer exposures. Care that stays continuous.",
  },
  {
    index: "02",
    title: "Cleanliness",
    body: "A cleaner world is specific. Fewer particles in lungs. Fewer liters lost underground. Fewer hours of fossil backup. Fewer materials on the way to a landfill.",
  },
  {
    index: "03",
    title: "Quality of life",
    body: "Daylight, quiet, warmth, and dignity. Efficiency that makes a room cold, dim, or anxious has failed. People should want to stay.",
  },
];

const refusals = [
  "We do not build chatbots that imitate care.",
  "We do not dim a room to win an energy badge.",
  "We do not call a model successful if the air, the water, or the appointment did not change.",
];

export function Manifesto() {
  return (
    <section id="thesis" className="scroll-mt-24 border-t border-line bg-foam">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">The thesis</p>
        <h2 className="mt-4 max-w-4xl font-serif text-3xl leading-tight font-medium sm:text-5xl">
          The purpose of this technology is not to talk. It is to leave a place healthier than we
          found it.
        </h2>
        <ul className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
          {refusals.map((line) => (
            <li key={line} className="py-4 text-base sm:text-lg">
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-16 grid items-start gap-12 lg:grid-cols-12">
          <figure className="lg:col-span-5">
            <img
              src="/images/life.jpg"
              alt="A daylight room with oak tables, linen, and a window onto trees"
              width={1728}
              height={1152}
              className="aspect-[3/2] w-full object-cover"
            />
            <figcaption className="mt-3 text-sm text-muted">
              Superior quality of life is a room you want to remain in.
            </figcaption>
          </figure>
          <ol className="lg:col-span-7 lg:pl-6">
            {commitments.map((item) => (
              <li key={item.index} className="border-t border-line py-6 first:border-t-0 first:pt-0">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-leaf">{item.index}</span>
                  <h3 className="font-serif text-2xl font-medium">{item.title}</h3>
                </div>
                <p className="mt-3 max-w-xl text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
