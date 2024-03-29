import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
export function AccordionChallenge() {
  return (
    <div className="flex w-full items-center justify-center  flex-col gap-12 my-24  px-12 lg:px-0">
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-lg md:max-w-6xl"
      >
        <AccordionItem value="item-1" className="py-8">
          <AccordionTrigger className="text-sm tracking-tight md:text-lg">
            Euler problem for critical thinking skills
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 py-12 gap-4 md:gap-12">
              {[1, 2, 3, 4, 5, 6].map((digit, index) => {
                return (
                  <Link href="/" key={digit + ""}>
                    <div className="square aspect-square  md:w-20 md:h-20 w-8 h-8 bg-secondary flex items-center justify-center font-semibold">
                      {digit}
                    </div>
                  </Link>
                );
              })}
              <Link href="/">
                <div className="square aspect-square  md:w-20 md:h-20 w-8 h-8 bg-ternary flex items-center justify-center font-semibold">
                  7
                </div>
              </Link>
              {[8, 9, 10, 11, 12, 13].map((digit, index) => {
                return (
                  <Link href="/" key={digit + ""}>
                    <div className="square aspect-square  md:w-20 md:h-20 w-8 h-8 bg-primary flex items-center justify-center font-semibold text-secondary">
                      {digit}
                    </div>
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="py-8">
          <AccordionTrigger className="text-sm tracking-tight md:text-lg">
            Is it styled?
          </AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="py-8">
          <AccordionTrigger className="text-sm tracking-tight md:text-lg">
            Is it animated?
          </AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
