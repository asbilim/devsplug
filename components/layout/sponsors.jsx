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
    <section
      id="sponsors"
      className="container py-24 sm:py-32 gap-4 hidden md:block"
    >
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 my-4">
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
