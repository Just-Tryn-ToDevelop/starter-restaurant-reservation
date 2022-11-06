const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tableService = require("./tables.service");
const validateBody = require("../errors/validateTableSelected");
const hasBody = validateBody("reservation_id");
const hasProperties = require("../errors/hasProperties");
const hasRequiredPorperties = hasProperties("table_name", "capacity");

function validTableNameLength(req, res, next) {
  const tableName = req.body.data.table_name;
  if (tableName.length > 1) {
    return next();
  }
  next({
    status: 400,
    message: "table_name must be at least 2 characters long.",
  });
}

function validCapacityNumber(req, res, next) {
  const capacity = req.body.data.capacity;
  if (capacity && capacity > 0 && Number.isInteger(capacity)) {
    return next();
  }
  next({
    status: 400,
    message: "capacity must be at least 1 person and must be a number.",
  });
}

async function validateTableName(req, res, next) {
  const { table_name } = req.body.data;
  const tables = await tableService.listTables();
  const table = tables.find((table) => table.table_name === table_name);
  if (!table) {
    return next();
  }
  next({
    status: 400,
    message: `Table: ${table_name} already exists. Please choose a different table name.`,
  });
}

async function validateReservationExists(req, res, next) {
  const reservation = await reservationsService.readReservation(
    req.params.reservation_id
  );
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation: ${req.params.reservation_id} can not be found.`,
  });
}

async function readReservation(req, res, next) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function validateIfOccupiedForUpdate(req, res, next) {
  const table = await tableService.readTable(req.params.table_id);
  if (table) res.locals.table = table;
  if (!table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: "This table is occupied. Please choose another table.",
  });
}

async function validateReservationIdExists(req, res, next) {
  const reserve = await reservationsService.readReservation(
    req.body.data.reservation_id
  );
  if (!reserve) {
    next({
      status: 404,
      message: `Reservation_id: ${req.body.data.reservation_id} does not exist.`,
    });
  } else {
    res.locals.reserve = reserve;
    console.log("line: 94", reserve);
    return next();
  }
}

function validateReservationStatusNotSeated(req, res, next) {
  const { reserve } = res.locals;
  console.log("line: 100", reserve.status);
  if (req.body.data && reserve.status !== "seated") {
    return next();
  }
  next({
    status: 400,
    message: `Reservation: ${req.body.data.reservation_id} is already seated.`,
  });
}

function validatePeopleLessThanCapacity(req, res, next) {
  const { reserve } = res.locals;
  const { table } = res.locals;
  if (reserve && reserve.people <= table.capacity) {
    return next();
  }
  next({
    status: 400,
    message: "Amount of people in reservation exceeds capacity of table.",
  });
}

async function validateTableExists(req, res, next) {
  const table = await tableService.readTable(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table with table id: ${req.params.table_id} does not exist.`,
  });
}

function validateIfOccupiedForDelete(req, res, next) {
  const { table } = res.locals;
  if (table.reservation_id && table.reservation_id > 0) {
    return next();
  }
  next({
    status: 400,
    message: "This table is not occupied.",
  });
}

async function update(req, res, next) {
  const { table, reserve } = res.locals;
  const updatedReservation = {
    ...reserve,
    status: "seated",
  };

  await reservationsService.updateReservation(updatedReservation);

  const updatedTable = {
    ...req.body.data,
    reservation_id: req.body.data.reservation_id,
    table_id: table.table_id,
  };
  const data = await tableService.updateTable(updatedTable);
  res.status(200).json({ data });
}

async function create(req, res, next) {
  const data = await tableService.createTable(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  const data = await tableService.listTables();
  res.json({ data });
}

async function destroy(req, res, next) {
  const { table } = res.locals;
  const reservation = await reservationsService.readReservation(
    table.reservation_id
  );
  const updatedReservation = {
    reservation_id: reservation.reservation_id,
    status: "finished",
  };
  await reservationsService.updateReservation(updatedReservation);

  const data = await tableService.deleteTable(table.table_id);

  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(validateReservationExists),
    asyncErrorBoundary(readReservation),
  ],
  update: [
    hasBody,
    asyncErrorBoundary(validateReservationIdExists),
    asyncErrorBoundary(validateIfOccupiedForUpdate),
    asyncErrorBoundary(validatePeopleLessThanCapacity),
    validateReservationStatusNotSeated,
    asyncErrorBoundary(update),
  ],
  create: [
    hasRequiredPorperties,
    asyncErrorBoundary(validateTableName),
    validTableNameLength,
    validCapacityNumber,
    asyncErrorBoundary(create),
  ],
  validateReservationExists,
  createTable: [
    hasRequiredPorperties,
    validTableNameLength,
    validCapacityNumber,
    asyncErrorBoundary(create),
  ],
  delete: [
    asyncErrorBoundary(validateTableExists),
    validateIfOccupiedForDelete,
    asyncErrorBoundary(destroy),
  ],
};
