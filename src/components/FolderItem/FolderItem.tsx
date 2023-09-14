import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { FolderData } from "../../types/Folder";
import "./FolderItem.css";

interface FolderProps {
  id?: number;
  name: string;
  children?: Array<FolderData>;
  defaultChecked?: boolean;
  defaultExpanded?: boolean;
  paddingLeft?: number;
  onChange?: (value: boolean) => void;
  className?: string;
  checkSubfolders?: boolean;
}

const CHILDREN_PADDING_LEFT = 20;

const FolderItem: React.FC<FolderProps> = ({
  id = 0,
  name,
  children = [],
  onChange,
  defaultChecked,
  defaultExpanded = false,
  checkSubfolders = false,
  paddingLeft = CHILDREN_PADDING_LEFT,
  className,
}) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isUndetermined, setIsUndetermined] = useState<boolean>(false);
  const [checkedChildrenCount, setCheckedChildrenCount] = useState<number>(0);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;

    setIsChecked(value);

    if (!value && checkSubfolders) {
      setCheckedChildrenCount(0);
    }

    if (onChange) {
      onChange(value);
    }
  };

  const handleChildCheck = (value: boolean) => {
    setCheckedChildrenCount((previousCheckedChildrenCount) =>
      value
        ? previousCheckedChildrenCount + 1
        : previousCheckedChildrenCount - 1
    );
  };

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (!isChecked && !isUndetermined && checkedChildrenCount > 0) {
      setIsUndetermined(true);
    }

    if ((checkedChildrenCount === 0 && isUndetermined) || isChecked) {
      setIsUndetermined(false);
    }
  }, [checkedChildrenCount, isChecked, isUndetermined]);

  useEffect(() => {
    if (defaultChecked !== undefined) {
      setIsChecked(defaultChecked);
    }
  }, [defaultChecked]);

  return (
    <div className={classNames("folder", className)}>
      <div className="folder__item" style={{ paddingLeft }}>
        <label htmlFor={id.toString()} className="checkbox">
          <input
            id={id.toString()}
            className="checkbox__input"
            type="checkbox"
            checked={isChecked}
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
              onChange={handleChildCheck}
              defaultChecked={checkSubfolders ? isChecked : undefined}
              checkSubfolders={checkSubfolders}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
