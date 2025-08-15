enum RoleEnum {
  SUPER_ADMIN = "SUPER ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export const getRoleColor = (role: RoleEnum): string => {
  switch (role) {
    case RoleEnum.SUPER_ADMIN:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case RoleEnum.ADMIN:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case RoleEnum.USER:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default RoleEnum;
