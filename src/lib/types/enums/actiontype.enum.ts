export enum ActionTypeEnum {
  SESSION_START = "SESSION START",
  RUN_CODE = "RUN CODE",
  SUBMIT_CODE = "SUBMIT CODE",
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export function getActionTypeColor(actionType: ActionTypeEnum) {
  switch (actionType) {
    case ActionTypeEnum.CREATE:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case ActionTypeEnum.READ:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case ActionTypeEnum.UPDATE:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case ActionTypeEnum.DELETE:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case ActionTypeEnum.SESSION_START:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case ActionTypeEnum.RUN_CODE:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    case ActionTypeEnum.SUBMIT_CODE:
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}
