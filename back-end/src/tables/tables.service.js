const knex = require("../db/connection");

function createTable(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdRecord) => createdRecord[0]);
}

function listTables() {
  return knex("tables").select("*").orderBy("table_name");
}

function updateTable(updatedTable) {
  return knex("tables")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updated) => updated[0]);
}

function readTable(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function deleteTable(table_id) {
  return knex("tables").where({ table_id }).del();
}

module.exports = {
  updateTable,
  createTable,
  listTables,
  readTable,
  deleteTable,
};
