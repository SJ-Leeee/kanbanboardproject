'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, {
        targetKey: 'id',
        foreignKey: 'assignee',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.belongsTo(models.Columns, {
        targetKey: 'id',
        foreignKey: 'columnId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.Comments, {
        sourceKey: 'id',
        foreignKey: 'cardId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Cards.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      columnId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assignee: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cardName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cardDesc: {
        type: Sequelize.STRING,
      },
      cardColor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'blue',
      },
      dueDate: {
        type: Sequelize.DATE,
      },
      // ""dueDate"": {
      //   ""start"": ""2023-06-07"",
      //   ""end"": ""2023-07-08""
      //   }
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
      modelName: 'Cards',
    },
  );
  return Cards;
};
