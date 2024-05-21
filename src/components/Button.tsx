import React, { memo } from 'react';

interface IButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
}

function Button({ onClick, text }: IButtonProps): JSX.Element {
  return (
    <button style={{ cursor: 'pointer' }} type="button" onClick={onClick}>
      {text}
    </button>
  );
}

export default memo(Button);
