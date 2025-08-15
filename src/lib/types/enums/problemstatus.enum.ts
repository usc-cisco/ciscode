enum SubmissionStatusEnum {
  SOLVED = "Solved",
  ATTEMPTED = "Attempted",
}

export const getStatusColor = (status?: SubmissionStatusEnum): string => {
  switch (status) {
    case SubmissionStatusEnum.SOLVED:
      return "bg-green-100 text-green-800";
    case SubmissionStatusEnum.ATTEMPTED:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default SubmissionStatusEnum;
