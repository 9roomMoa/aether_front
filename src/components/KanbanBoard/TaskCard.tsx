interface TaskCardProps {
  title: string;
  description: string;
  status: string;
  onClick: () => void;
  isSelected: boolean;
  className?: string;
  isCompact?: boolean;
}

const getBorderColor = (status: string) => {
  switch (status) {
    case "To Do":
      return "#FFA85C";
    case "In Progress":
      return "#5CA8FF";
    case "Done":
      return "#5EC98B";
    case "Issue":
      return "#FF615C";
    case "Hold":
      return "#949BAD";
    default:
      return "#E5EAF2";
  }
};

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  status,
  onClick,
  isSelected,
  className,
  isCompact = false
}) => {
  // const [sortOption, setSortOption] = useState("마감일순");
  const borderColor = getBorderColor(status);
  if (isCompact) {
    //회색 내용 박스만 있는 TaskCard (Header 제거)
    return (
      <div
        onClick={onClick}
        className={`flex flex-col gap-2 p-4 rounded cursor-pointer bg-[#F3F5F8] ${className}`}
        style={{
          border: `1px solid ${isSelected ? borderColor : "#E5EAF2"}`,
        }}
      >
        <p className="text-[16px] font-semibold text-[#4F5462] m-0">{title}</p>
        <p className="text-xs text-[#4F5462] m-0 mt-1">{description}</p>
      </div>
    );
  }

  // 기존 흰색 박스 + 정렬 select 포함된 구조
  return (
    <div
      className={`flex flex-col min-w-[362px] max-w-[402px] p-5 rounded-md shadow-md gap-3 bg-[#FCFCFF] ${className || ""}`}
      style={{
        borderTop: `8px solid ${borderColor}`,
      }}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-semibold text-[#4F5462] m-0">{title}</h4>
        </div>
        <select
          value={"마감일순"}
          onChange={() => {}}
          className="text-xs text-[#949BAD] bg-transparent cursor-pointer border-none focus:outline-none"
        >
          <option value="마감일순">마감일순</option>
          <option value="최신생성일순">최신생성일순</option>
        </select>
      </div>

      <div
        onClick={onClick}
        className="flex flex-col gap-2 p-4 rounded cursor-pointer bg-[#F3F5F8]"
        style={{
          border: `1px solid ${isSelected ? borderColor : "#E5EAF2"}`,
        }}
      >
        <p className="text-[20px] font-normal text-[#4F5462] m-0">{title}</p>
        <p className="text-xs text-[#4F5462] m-0 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default TaskCard;
