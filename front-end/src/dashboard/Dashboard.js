import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { listReservations, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ListTables from "./ListTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const queryParams = useQuery();
  const queryDate = queryParams.get("date");
  if (queryDate) date = queryDate;

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  async function cancelHandler(e) {
    const { value } = e.target;
    const reservation = reservations.find(
      (reservation) => reservation.reservation_id === Number(value)
    );
    const warningMessage = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    reservation.status = "cancelled";
    if (warningMessage) {
      try {
        await updateReservation(reservation);
        history.push(`/reservations?date=${reservation.reservation_date}`);
      } catch (error) {
        setReservationsError(error);
      }
    }
  }

  const resList = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      {reservation.status !== "finished" &&
      reservation.status !== "cancelled" ? (
        <>
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </td>
          <td>
            {reservation.status === "booked" ? (
              <>
                <div className="dropdown">
                  <button
                    className="btn btn-warning dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Options
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <Link
                      className="dropdown-item"
                      to={`/reservations/${reservation.reservation_id}/seat`}
                    >
                      Seat
                    </Link>
                    <Link
                      className="dropdown-item"
                      to={`/reservations/${reservation.reservation_id}/edit`}
                    >
                      Edit
                    </Link>
                  </div>
                  <button
                    className="dropdown-item"
                    onClick={cancelHandler}
                    type="button"
                    value={reservation.reservation_id}
                    data-reservation-id-cancel={reservation.reservation_id}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </td>
        </>
      ) : (
        <></>
      )}
    </tr>
  ));

  return (
    <>
      {/* <div className="row" id="headerRow"> */}
      <div className="row m-3 " id="dashboardHeader">
        <div className=" col-lg-7 col-xl-8 col-md-3 col-sm-6 col-12">
          <h1 className="mr-2" id="dashBoardTitle">
            Dashboard
          </h1>
        </div>
        <div className="col-md-4 col-sm-6 col-12" id="dashDate">
          <h1>{date}</h1>
        </div>
        <div className=" col-lg-5 col-xl-4 col-md-5" id="buttons">
          <Link to={`/dashboard?date=${previous(date)}`}>
            <button type="button" className="btn btn-secondary mr-1">
              Previous
            </button>
          </Link>
          <Link to={"/"}>
            <button type="button" className="btn btn-success mr-1">
              Today
            </button>
          </Link>
          <Link to={`/dashboard?date=${next(date)}`}>
            <button type="button" className="btn btn-primary ">
              Next
            </button>
          </Link>
        </div>
      </div>
      {/* </div> */}

      <main>
        <ErrorAlert error={reservationsError} />
        <button
          className="btn btn-secondary"
          type="button"
          data-toggle="collapse"
          id="showReservations"
          data-target="#reservations"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Reservations
        </button>{" "}
        <button
          className="btn btn-secondary"
          type="button"
          data-toggle="collapse"
          data-target="#tables"
          id="showTables"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Tables
        </button>
        <div className="row m-3" style={{ justifyContent: "space-between" }}>
          <div
            className="col-lg-7 col-xl-8 col-sm-12 col-12 pt-3 collapse"
            id="reservations"
          >
            <h4 className="text-center mb-3">Reservations for {date}</h4>

            {!reservations.some(
              (reservation) =>
                reservation.status === "booked" ||
                reservation.status === "seated"
            ) ? (
              <p>No reservations for this day.</p>
            ) : (
              <table className="table table-responsive-xl border">
                <thead>
                  <tr>
                    <th scope="col">First</th>
                    <th scope="col">Last </th>
                    <th scope="col">Number</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">People</th>
                    <th scope="col">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-center">{resList}</tbody>
              </table>
            )}
          </div>
          <div
            className="col-lg-5 col-xl-4 col-sm-12 col-12 pt-3 collapse"
            id="tables"
            style={{ width: "100%" }}
          >
            <h4 className="text-center mb-3">Tables</h4>
            <ListTables
              reservations={reservations}
              setReservations={setReservations}
              date={date}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
