import { SyntheticEvent } from 'react';
import { CategoryInfo } from '../../api/types/category.data.type';
import { Badge } from '../shadcn/ui/badge';

interface Props {
  selectedCategories: CategoryInfo[];
  badgeClickHandler: (id: number) => void;
}

function CategoryBadgeList({ selectedCategories, badgeClickHandler }: Props) {
  const clickHandler = (e: SyntheticEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!target.dataset['key']) return;
    badgeClickHandler(Number.parseInt(target.dataset['key']));
  };

  return (
    <div className="space-x-1">
      {selectedCategories.map((selectedCategory) => (
        <Badge
          className="h-12 text-base"
          key={selectedCategory.id}
          data-key={selectedCategory.id}
          onClick={clickHandler}
        >
          {selectedCategory.name}
        </Badge>
      ))}
    </div>
  );
}

export default CategoryBadgeList;
