/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const { validateReservationExists } = require("../tables/tables.controller");
const hasProperties = require("../errors/hasProperties");
const hasUpdateBody = hasProperties("status");
const hasRequiredPorperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function validateDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const pattern = /^\d{4}[- ]?\d{2}[- ]?\d{2}$/;
  if (date.match(pattern)) {
    return next();
  }

  next({
    status: 400,
    message: "Please enter a valid reservation_date.",
  });
}

function validDayOfWeek(req, res, next) {
  const date = req.body.data.reservation_date;
  const time = req.body.data.reservation_time;
  const day = new Date(`${date} ${time}`);
  if (day.getDay() !== 2) {
    return next();
  }
  next({
    status: 400,
    message: "We are closed on Tuesdays. Please choose another day.",
  });
}

function notInThePast(req, res, next) {
  const date = req.body.data.reservation_date;
  const time = req.body.data.reservation_time;
  const resDate = new Date(`${date} ${time}`);
  const today = Date.now();
  if (resDate.valueOf() > today.valueOf()) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be for a future date.",
  });
}

function validateTime(req, res, next) {
  let time = req.body.data.reservation_time;
  const displayPattern = /^\d{2}:\d{2}$/;
  if (time.match(displayPattern)) {
    return next();
  }
  next({
    status: 400,
    message: "Please enter a valid reservation_time.",
  });
}

function validHours(req, res, next) {
  const time = req.body.data.reservation_time;
  const date = req.body.data.reservation_date;
  const reservationDate = new Date(`${date} ${time}`);
  const open = new Date(`${date} 10:30`);
  const close = new Date(`${date} 21:30`);

  if (
    reservationDate.getTime() >= open.getTime() &&
    reservationDate.getTime() <= close.getTime()
  ) {
    return next();
  }
  next({
    status: 400,
    message:
      "Please enter a reservation_time that is during our business hours, 10:30 AM - 9:30 PM. Thank you!",
  });
}

function validatePhoneNUmber(req, res, next) {
  let phoneNumber = req.body.data.mobile_number;
  const pattern = /^([0-9]{3})[-]?([0-9]{3})[-]?([0-9]{4})$/;
  if (phoneNumber.match(pattern)) {
    phoneNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
    return next();
  }
  next({
    status: 400,
    message: "Please enter a valid phone number.",
  });
}

function validatePeople(req, res, next) {
  const partyAmount = req.body.data.people;
  if (partyAmount && partyAmount > 0 && Number.isInteger(partyAmount)) {
    return next();
  }
  next({
    status: 400,
    message: "Please enter a valid value for people",
  });
}

function validateDefaultStatusBooked(req, res, next) {
  const { status } = req.body.data;
  if (!status) return next();
  if (status) {
    if (status === "booked") {
      return next();
    }
  }
  next({
    status: 400,
    message: `Status: ${status} is invalid for creation of reservation.`,
  });
}

function validateCorrectStatusTerms(req, res, next) {
  const { status } = req.body.data;
  const terms = ["booked", "seated", "finished", "cancelled"];

  if (terms.includes(status)) return next();
  next({
    status: 400,
    message: `Status: ${status} is an incorrect status.`,
  });
}

function validateCurrentStatusNotFinished(req, res, next) {
  const { reservation } = res.locals;

  if (reservation.status !== "finished") return next();
  next({
    status: 400,
    message: `Cannot update finished reservation.`,
  });
}

async function list(req, res) {
  const date = req.query.date;
  const number = req.query.mobile_number;
  if (date) {
    const data = await service.listReservations(date);
    res.json({ data });
  }
  if (number) {
    const data = await service.search(number);
    res.json({ data });
  }
}

async function create(req, res, next) {
  const data = await service.createReservation(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res, next) {
  const statuses = ["cancelled", "finished", "seated", "booked"];
  let newStatus = statuses.filter((status) => req.body.data.status === status);
  newStatus = newStatus.toString();
  const updatedReservation = {
    reservation_id: req.params.reservation_id,
    status: newStatus,
  };
  const data = await service.updateReservation(updatedReservation);
  res.status(200).json({ data });
}

async function editReservation(req, res, next) {
  const editedReservation = {
    ...req.body.data,
    reservation_id: req.params.reservation_id,
  };
  const data = await service.updateReservation(editedReservation);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredPorperties,
    validatePeople,
    validatePhoneNUmber,
    validateDate,
    validateTime,
    validDayOfWeek,
    notInThePast,
    validHours,
    validateDefaultStatusBooked,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(validateReservationExists),
    hasUpdateBody,
    validateCorrectStatusTerms,
    validateCurrentStatusNotFinished,
    asyncErrorBoundary(update),
  ],
  edit: [
    asyncErrorBoundary(validateReservationExists),
    hasRequiredPorperties,
    validatePeople,
    validatePhoneNUmber,
    validateDate,
    validateTime,
    validDayOfWeek,
    notInThePast,
    validHours,
    validateDefaultStatusBooked,
    asyncErrorBoundary(editReservation),
  ],
};
