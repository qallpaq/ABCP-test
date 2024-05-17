import React, {memo} from "react";

interface IGetUserInfoButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function GetUserInfoButton({ onClick }: IGetUserInfoButtonProps): JSX.Element {
  return (
    <button type="button" onClick={onClick}>
      get random user
    </button>
  );
}

export default memo(GetUserInfoButton)
