
exports.up = function(knex) {
  return knex.schema.createTable("movies_theaters", function(table) {
    table.integer("movie_id")
        .unsigned()       // Ensure positive integer value  
        .references("movie_id")
        .inTable("movies")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();

    table.integer("theater_id")
        .unsigned()
        .references("theater_id")
        .inTable("theaters")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();

    table.boolean("is_showing").defaultTo(false);

    table.primary(["movie_id", "theater_id"]); // no two rows can have the same movie_id and theater_id values simultaneously.
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("movies_theaters");
};
