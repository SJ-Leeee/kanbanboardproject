'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Boards extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        targetKey: 'id',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.InvitedUsers, {
        sourceKey: 'id',
        foreignKey: 'boardId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.Columns, {
        sourceKey: 'id',
        foreignKey: 'boardId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Boards.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      boardName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      boardDesc: {
        type: Sequelize.STRING,
      },
      boardColor: {
        // dD??D?D?
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'white',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    },
    {
      sequelize,
      modelName: 'Boards',
    },
  );
  return Boards;
};
