import { Renderable, toast, ToastPosition } from 'react-hot-toast';

const duration = 2000;
const position: ToastPosition = 'bottom-center';
export const displayCopySuccessToast = (
  message: string,
  icon: Renderable,
  backgroundColor: string,
  color: string
) => {
  toast.success(message, {
    duration: duration,
    position: position,
    style: {
      backgroundColor: backgroundColor,
      color: color
    },
    icon: icon
  });
};

export const displayErrorToast = (
  message: string,
  icon: Renderable,
  backgroundColor: string,
  color: string
) => {
  toast.error(message, {
    duration: duration,
    position: position,
    style: {
      backgroundColor: backgroundColor,
      color: color
    },
    icon: icon
  });
};
