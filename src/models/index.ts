import { User } from './user.model';
import { Problem } from './problem.model';

export const defineAssociations = () => {
  Problem.belongsTo(User, {
    foreignKey: 'authorId',
    as: 'author'
  });

  User.hasMany(Problem, {
    foreignKey: 'authorId',
    as: 'problems'
  });
};

export { User, Problem };