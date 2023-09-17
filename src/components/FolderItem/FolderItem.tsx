import React, { useState, memo } from "react";
import classNames from "classnames";
import { FolderData } from "../../types/Folder";
import { isExpandedByDefault } from "../../utils/isExpandedByDefault";
import "./FolderItem.css";

interface FolderProps {
  id?: number;
  name: string;
  children?: Array<FolderData>;
  checked: boolean;
  isUndetermined?: boolean;
  defaultExpanded?: boolean;
  paddingLeft?: number;
  onChange?: (value: boolean, id: number) => void;
  className?: string;
}

const CHILDREN_PADDING_LEFT = 20;

function FolderItem({
  id = 0,
  name,
  children = [],
  onChange,
  checked,
  isUndetermined,
  defaultExpanded = false,
  paddingLeft = CHILDREN_PADDING_LEFT,
  className,
}: FolderProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;

    if (onChange) {
      onChange(value, id);
    }
  };

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={classNames("folder", className)}>
      <div className="folder__item" style={{ paddingLeft }}>
        <label htmlFor={id.toString()} className="checkbox">
          <input
            id={id.toString()}
            className="checkbox__input"
            type="checkbox"
            checked={checked}
            onChange={handleCheck}
          />
          <div
            className={classNames(
              "checkbox__box",
              isUndetermined && "undetermined"
            )}
          ></div>
          <span className="">{name}</span>
        </label>
        {children.length > 0 && (
          <div
            className={classNames(
              "folder__item__collapse",
              expanded && "expanded"
            )}
            onClick={handleExpandToggle}
          ></div>
        )}
      </div>

      {children.length > 0 && (
        <div className="folder__children" aria-expanded={expanded}>
          {children.map((folderData) => (
            <FolderItem
              key={folderData.id}
              id={folderData.id}
              name={folderData.name}
              children={folderData.children}
              paddingLeft={paddingLeft + CHILDREN_PADDING_LEFT}
              onChange={onChange}
              checked={folderData.checked}
              defaultExpanded={isExpandedByDefault(folderData.created)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(FolderItem);
