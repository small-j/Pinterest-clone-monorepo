import { FieldValues, useForm } from 'react-hook-form';
import { Label } from '../shadcn/ui/label';
import { Input } from '../shadcn/ui/input';
import { Textarea } from '../shadcn/ui/textarea';
import { useEffect, useState } from 'react';
import CategoryCombobox from '../category/CategoryCombobox';
import { CategoryInfo } from '../../api/types/category.data.type';
import CategoryBadgeList from '../category/CategoryBadgeList';
import { getCategories } from '../../api/category.api';
import { ErrorResponse, Response } from '@/src/api/types/common.data.type';

function ImagePinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tagCnt, setTagCnt] = useState(0);
  const [categoryIds, setCategoryIds] = useState<Set<number>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<CategoryInfo[]>(
    [],
  );
  const [categories, setCategories] = useState<
    Response<CategoryInfo[]> | ErrorResponse
  >();

  useEffect(() => {
    getCategories((res: Response<CategoryInfo[]> | ErrorResponse) => {
      setCategories(res);
    });
  }, []);

  const isErrorResponse = (
    response: Response<CategoryInfo[]> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };

  const selectHandler = (value: number) => {
    if (!categories || !categories.data) return;
    const category = categories.data.find((category) => category.id === value);

    if (!category) return;
    setTagCnt(categoryIds.size + 1);

    categoryIds.add(category.id);
    setCategoryIds(categoryIds);

    setSelectedCategories(getSelectedCategories());
  };

  const deleteCategory = (id: number) => {
    setTagCnt(categoryIds.size - 1);

    categoryIds.delete(id);
    setCategoryIds(categoryIds);

    setSelectedCategories(getSelectedCategories());
  };

  const getSelectedCategories = (): CategoryInfo[] => {
    return categories?.data?.filter((category) => categoryIds.has(category.id)) || [];
  };

  const requestCreateImageMeta = (data: FieldValues) => {};

  return (
    <>
      {!categories && <div>loading..</div>}
      {isErrorResponse(categories) && <div>{categories.errorMessage}</div>}
      {categories?.success && categories.data && (
        <form
          className="flex flex-col items-center w-full space-y-6"
          onSubmit={handleSubmit((data) => requestCreateImageMeta(data))}
        >
          <div className="control mt-1 w-full">
            <Label>제목</Label>
            <Input
              placeholder="제목 추가"
              {...register('title', { required: true })}
            />
            {errors.title && (
              <p>{errors.title.message?.toString() || '제목은 필수입니다.'}</p>
            )}
          </div>
          <div className="control mt-1 w-full">
            <Label>설명</Label>
            <Textarea
              placeholder="자세한 설명을 추가하세요."
              {...register('content')}
            ></Textarea>
          </div>
          <div className="control mt-1 w-full space-y-1">
            <Label>태그된 주제 ({tagCnt})개</Label>
            <div>
              <CategoryCombobox
                selectHandler={selectHandler}
                items={categories.data}
              ></CategoryCombobox>
            </div>
            <CategoryBadgeList
              selectedCategories={selectedCategories}
              badgeClickHandler={deleteCategory}
            ></CategoryBadgeList>
          </div>
        </form>
      )}
    </>
  );
}
export default ImagePinForm;
