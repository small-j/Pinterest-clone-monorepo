import { useState } from 'react';
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

  const selectCommandItemHandler = (value: string) => {
    selectHandler(Number.parseInt(value));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>태그 추가</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>결과를 찾을 수 없습니다.</CommandEmpty>
            <CommandGroup heading="일치 태그">
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id.toString()}
                  onSelect={selectCommandItemHandler}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export default CategoryCombobox;
