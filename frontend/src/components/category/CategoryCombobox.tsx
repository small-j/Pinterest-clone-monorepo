import { SyntheticEvent, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../shadcn/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/ui/popover';
import { CategoryInfo } from '../../api/types/category.data.type';
import { Button } from '../shadcn/ui/button';

interface Props {
  selectHandler: (value: number) => void;
  items: CategoryInfo[];
}

function CategoryCombobox({ selectHandler, items }: Props) {
  const [open, setOpen] = useState(false);

  const clickHandler = (e: SyntheticEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!target.dataset['id']) return; // todo 알수 없는 에러 alert 띄우기.
    selectHandler(Number.parseInt(target.dataset['id']));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>태그 추가</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="태그 검색" className="h-9" />
          <CommandList>
            <CommandEmpty>결과를 찾을 수 없습니다.</CommandEmpty>
            {items && (
              <CommandGroup heading="일치 태그" onClick={clickHandler}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    data-id={item.id}
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export default CategoryCombobox;
