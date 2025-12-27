export const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W]).{8,}$/;
  return regex.test(password);
};