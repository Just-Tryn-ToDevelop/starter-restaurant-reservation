/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const tablesController = require("../tables/tables.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:reservation_id").get(tablesController.read).put(controller.edit).all(methodNotAllowed)
router.route("/:reservation_id/status").put(controller.update).all(methodNotAllowed)

module.exports = router;
