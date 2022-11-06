import Button from 'react-bootstrap/Button';
import { BsArrowRepeat } from 'react-icons/bs';
import './LoaderButton.css';

type LoaderButtonProps = Parameters<typeof Button>[0] & {
  isLoading: boolean;
};

export default function LoaderButton({
  isLoading,
  className = '',
  disable = false,
  ...props
}: LoaderButtonProps) {
  return (
    <Button
      disabled={disable || isLoading}
      className={`LoaderButton ${className}`}
      {...props}
    >
      {isLoading && <BsArrowRepeat className="spinning" />}
      {props.children}
    </Button>
  );
}
