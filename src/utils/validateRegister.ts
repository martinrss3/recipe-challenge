import { UserInput } from "../resolvers/user";

export const validateRegister = (options: UserInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (options.name.length <= 2) {
    return [
      {
        field: "name",
        message: "length must be greater than 2",
      },
    ];
  }

  if (options.name.includes("@")) {
    return [
      {
        field: "name",
        message: "cannot include an @",
      },
    ];
  }

  if (options.password.length <= 7) {
    return [
      {
        field: "password",
        message: "password must be equal or greater than 8 characters",
      },
    ];
  }

  return null;
};
