import React, { FC } from 'react';

interface Props {
  direction: 'up' | 'down' | 'left' | 'right';
  className?: string;
  size?: number;
}

const Arrow: FC<Props> = ({ direction, className, size }) => {
  const generateSVGCode = () => {
    switch (direction) {
      case 'up':
        return 'M0,12A12,12,0,1,0,12,0,12,12,0,0,0,0,12Zm1,0A11,11,0,1,0,12,1,11,11,0,0,0,1,12ZM12.5,7.17l3.76,4.61L17,11.1,12,5,7,11.11l.75.67L11.5,7.17V19h1Z';
      case 'down':
        return 'M24,12A12,12,0,1,0,12,24,12,12,0,0,0,24,12Zm-1,0A11,11,0,1,0,12,23,11,11,0,0,0,23,12ZM11.5,16.83,7.74,12.22,7,12.9,12,19l5-6.11-.75-.67L12.5,16.83V5h-1Z';
      case 'left':
        return 'M12,24A12,12,0,1,0,0,12,12,12,0,0,0,12,24Zm0-1A11,11,0,1,0,1,12,11,11,0,0,0,12,23ZM7.17,11.5l4.61-3.76L11.1,7,5,12l6.11,5,.67-.75L7.17,12.5H19v-1Z';
      case 'right':
        return 'M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm0,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm4.83,11.5-4.61,3.76.68.74L19,12,12.89,7l-.67.75,4.61,3.75H5v1Z';
      default:
        return 'M0,12A12,12,0,1,0,12,0,12,12,0,0,0,0,12Zm1,0A11,11,0,1,0,12,1,11,11,0,0,0,1,12ZM12.5,7.17l3.76,4.61L17,11.1,12,5,7,11.11l.75.67L11.5,7.17V19h1Z';
    }
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size}>
      <path
        d={generateSVGCode()}
        className={className}
        style={{ fillRule: 'evenodd' }}
        transform="translate(0 0)"
      />
    </svg>
  );
};

export default Arrow;
