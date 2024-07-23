
export const comparePassword = (enteredPassword: string, storedPassword: number): boolean => {
    return enteredPassword === storedPassword.toString();
  };