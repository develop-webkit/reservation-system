import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { getErrorMessage } from '../api/utils.js';

export function useAppMutation(options) {
  const { message } = App.useApp();

  return useMutation({
    ...options,
    onSuccess: (data, variables, context) => {
      if (options.successMessage) {
        message.success(options.successMessage);
      }

      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      message.error(getErrorMessage(error, options.errorMessage));
      options.onError?.(error, variables, context);
    },
  });
}
