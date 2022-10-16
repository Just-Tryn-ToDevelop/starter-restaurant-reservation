/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredPorperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function validatePhoneNUmber(req, res, next) {
  const phoneNumber = req.body.data.mobile_number;
  const pattern = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/
  if (phoneNumber.match(pattern)) {
    return next();
  }
  next({
    status: 400,
    message: "Phone number is either too long, too short, or has letters. Please enter a valid phone number.",
  });
}

function hasEnoughInParty(req, res, next) {
  const partyAmount = Number(req.body.data.people);
  if (partyAmount > 0) {
    return next();
  }
  next({
    status: 400,
    message: "Amount of people in party must be more than 0",
  });
}

async function list(req, res) {
  const date = req.query.date;
  const data = await service.listReservations(date);
  res.json({ data });
}

async function create(req, res, next) {
  const data = await service.createReservation(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredPorperties, hasEnoughInParty, validatePhoneNUmber, asyncErrorBoundary(create)],
};
