import { Category } from "@/data/games";
import { GameCard } from "@/components/GameCard";

interface CategorySectionProps {
  category: Category;
  index: number;
}

export function CategorySection({ category, index }: CategorySectionProps) {
  return (
    <section id={category.id} className="pt-12 sm:pt-16">
      <div className="flex items-center gap-3 mb-8">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} text-white text-2xl shadow-lg`}
        >
          {category.icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {category.titleJa}
          </h3>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.games.map((game, gameIndex) => (
          <GameCard key={game.id} game={game} index={gameIndex} />
        ))}
      </div>
    </section>
  );
}
