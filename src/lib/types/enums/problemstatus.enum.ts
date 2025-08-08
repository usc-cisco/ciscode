enum ProblemStatusEnum {
    SOLVED = "Solved",
    ATTEMPTED = "Attempted",
}

export const getStatusColor = (status?: ProblemStatusEnum): string => {
    switch (status) {
        case ProblemStatusEnum.SOLVED:
            return "bg-green-100 text-green-800";
        case ProblemStatusEnum.ATTEMPTED:
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default ProblemStatusEnum;