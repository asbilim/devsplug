export default function ChallengeLegend() {
  return (
    <div className="flex items-center justify-center mt-24 px-12">
      <div className="flex w-full lg:max-w-6xl flex-col md:max-w-4xl gap-12">
        <h1 className="font-semibold text-3xl">List of challenges</h1>
        <div className="legends flex flex-col gap-6">
          <div className="legend-item flex md:gap-24 items-center gap-3">
            <div className="square aspect-square  md:w-20 md:h-20 w-12 h-12 bg-slate-600 dark:bg-slate-200"></div>
            <p className="text-sm md:text-lg">challenges that are easy</p>
          </div>
          <div className="legend-item flex md:gap-24 items-center  gap-3">
            <div className="square aspect-square  md:w-20 md:h-20 w-12 h-12 bg-neutral-600"></div>
            <p className="text-sm md:text-lg">challenges a little bit harder</p>
          </div>
          <div className="legend-item flex md:gap-24 items-center  gap-3">
            <div className="square aspect-square lg:w-20 md:w-20 md:h-20 w-12 h-12 lg:h-20 bg-zinc-950 dark:bg-red-900"></div>
            <p className="text-sm md:text-lg">
              hardest challenges require strong understanding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
