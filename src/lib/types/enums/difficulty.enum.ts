enum DifficultyEnum {
    PROG1 = "Prog 1",
    PROG2 = "Prog 2",
    DSA = "DSA",
}

export const getDifficultyColor = (difficulty: DifficultyEnum): string => {
    switch (difficulty) {
        case DifficultyEnum.PROG1:
            return "bg-green-100 text-green-800";
        case DifficultyEnum.PROG2:
            return "bg-blue-100 text-blue-800";
        case DifficultyEnum.DSA:
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default DifficultyEnum;