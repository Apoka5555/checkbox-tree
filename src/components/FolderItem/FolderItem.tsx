import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { FolderData } from "../../types/Folder";
import { isExpandedByDefault } from "../../utils/isExpandedByDefault";
import { useRecoilValue } from "recoil";
import { includeSubfolders } from "../../stores/app.store";
import "./FolderItem.css";

interface FolderProps {
  id?: number;
  name: string;
  children?: Array<FolderData>;
  defaultChecked?: boolean;
  defaultExpanded?: boolean;
  paddingLeft?: number;
  onChange?: (value: boolean, hasCheckedChildren: boolean) => void;
  className?: string;
}

const CHILDREN_PADDING_LEFT = 20;

const FolderItem: React.FC<FolderProps> = ({
  id = 0,
  name,
  children = [],
  onChange,
  defaultChecked,
  defaultExpanded = false,
  paddingLeft = CHILDREN_PADDING_LEFT,
  className,
}) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  const [isChecked, setIsChecked] = useState<boolean>(Boolean(defaultChecked));
  const [isUndetermined, setIsUndetermined] = useState<boolean>(false);
  const [checkedChildrenCount, setCheckedChildrenCount] = useState<number>(0);
  const [childrenFolders, setChildrenFolders] =
    useState<Array<FolderData>>(children);

  const checkSubfolders = useRecoilValue(includeSubfolders);

  const updateChildrenFolders = (value: boolean) => {
    setChildrenFolders((previousChildrenFolders) =>
      previousChildrenFolders.map((folder: FolderData) => {
        return {
          ...folder,
          checked: value,
        };
      })
    );
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;

    let newCheckedChildrenCount = checkedChildrenCount;

    if (checkSubfolders) {
      newCheckedChildrenCount = value ? children.length : 0;
      setCheckedChildrenCount(newCheckedChildrenCount);
    }

    updateChildrenFolders(value);

    setIsChecked(value);

    if (onChange) {
      onChange(value, newCheckedChildrenCount > 0);
    }
  };

  const handleChildCheck = (value: boolean, hasCheckedChildren: boolean) => {
    const isUndeterminedChild = !value && hasCheckedChildren;

    let newCheckedChildrenCount = checkedChildrenCount;

    if (value) {
      newCheckedChildrenCount++;
    } else if (!isUndeterminedChild) {
      newCheckedChildrenCount--;
    }

    setCheckedChildrenCount(newCheckedChildrenCount);

    if (onChange) {
      onChange(value, newCheckedChildrenCount > 0);
    }
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
    if (defaultChecked === undefined) {
      return;
    }

    updateChildrenFolders(defaultChecked);

    if (checkSubfolders) {
      setIsChecked(defaultChecked);
      setCheckedChildrenCount(defaultChecked ? children.length : 0);
    }
  }, [checkSubfolders, children.length, defaultChecked]);

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

      {childrenFolders.length > 0 && (
        <div className="folder__children" aria-expanded={expanded}>
          {childrenFolders.map((folderData) => (
            <FolderItem
              key={folderData.id}
              id={folderData.id}
              name={folderData.name}
              children={folderData.children}
              paddingLeft={paddingLeft + CHILDREN_PADDING_LEFT}
              onChange={handleChildCheck}
              defaultChecked={folderData.checked}
              defaultExpanded={isExpandedByDefault(folderData.created)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
