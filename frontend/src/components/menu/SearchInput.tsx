import { useNavigate } from 'react-router-dom';
import { KeyboardEvent, useState } from 'react';

interface Props {
  className?: string;
}

function SearchInput({ className = '' }: Props) {
  const navigate = useNavigate();
  const [value, setValue] = useState<string>();

  const inputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value) {
      navigate(`/search/${value}`);
    }
  };

  return (
    <div className={className}>
      <input
        className='w-full h-[48px] bg-[rgb(241,241,241)] rounded-full px-[16px]'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={inputHandler}
        placeholder="검색"
      />
    </div>
  );
}

export default SearchInput;
