import { SiPython, SiC, SiCplusplus } from "react-icons/si";
import React from "react";

const sponsors = [
  {
    iconType: SiPython,
    name: "Python",
  },
  {
    iconType: SiC,
    name: "C",
  },
  {
    iconType: SiCplusplus,
    name: "C++",
  },
];

export const Sponsors = () => {
  return (
    <section id="sponsors" className="container pt-24 sm:py-32">
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Supported Programming Languages
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
        {sponsors.map(({ iconType, name }) => (
          <div
            key={name}
            className="flex items-center gap-4 text-muted-foreground/60"
          >
            {React.createElement(iconType, {
              size: 25,
              className: "text-primary",
            })}
            <h3 className="text-primary font-bold">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
