import React, { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

const ProjectDescription: React.FC = () => {
  const maxLength = 364;
  const { register, watch } = useFormContext();
  const description = watch("description") || "";

  return (
    <div className="w-[1248px] h-[136px] px-4 py-3 bg-[#f3f5f8] rounded-lg shadow-[inset_0px_0px_4px_0px_rgba(26,26,35,0.12)] flex flex-col justify-start items-end gap-2.5">
      <textarea
        {...register("description", {
          maxLength: {
            value: maxLength,
            message: `최대 ${maxLength}자까지 입력 가능합니다.`,
          },
        })}
        placeholder="프로젝트 설명을 입력하세요."
        className="self-stretch flex-1 bg-transparent outline-none resize-none text-[#4f5462] text-base font-semibold leading-normal"
      />
      <div className="inline-flex justify-start items-start gap-0.5">
        <div className="text-right text-[#949bad] text-xs font-medium leading-none">
          ({description.length}/{maxLength})
        </div>
      </div>
    </div>
  );
};

export default ProjectDescription;
