module.exports = (sequelize, DataTypes) => {
    const Books = sequelize.define(
        "books", {
            image: {
                type: DataTypes.STRING, // monimage.png
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            author: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            genre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            note: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            timestamps: false
        }
    )

    return Books
}