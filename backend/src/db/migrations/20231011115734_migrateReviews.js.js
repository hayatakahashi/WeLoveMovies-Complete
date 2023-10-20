
exports.up = function(knex) {
  return knex.schema.createTable("reviews", function(table) {
    table.increments("review_id").primary();
    table.text("content");
    table.integer("score");
    table.integer("critic_id")
        .references("critic_id")
        .inTable("critics")
        .onDelete("CASCADE")  // If a critic is deleted, their reviews are deleted as well
        .onUpdate("CASCADE");  // If a critic is updated, their reviews are updated as well 

    table.integer("movie_id")
        .references("movie_id")    
        .inTable("movies")
        .onDelete("CASCADE")    // if a movie is deleted, its reviews are deleted as well
        .onUpdate("CASCADE");

    table.timestamps(true, true); // created_at and updated_at fields
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("reviews")
};
