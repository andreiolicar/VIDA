"use strict";
module.exports = (sequelize, DataTypes) => {
  const Health = sequelize.define(
    "Health",
    {
      gender: DataTypes.STRING,
      age: DataTypes.INTEGER,
      weight: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      pains: DataTypes.TEXT,
      notes: DataTypes.TEXT,
      date: DataTypes.DATE,
    },
    {}
  );

  return Health;
};
