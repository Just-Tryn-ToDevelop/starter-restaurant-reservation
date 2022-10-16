import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const queryParams = useQuery();
  const queryDate = queryParams.get("date");
  if (queryDate) date = queryDate

  const resList = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
    </tr>
  ));

  return (
    <>
      <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
        <h4 className="mb-0 mr-auto">Reservations for date {date}</h4>
        <a href={`/dashboard?date=${previous(date)}`}><button type="button" className="btn btn-secondary mr-1" >Previous</button></a>
        <a href={"/"}><button type="button" className="btn btn-success mr-1">Today</button></a>
        <a href={`/dashboard?date=${next(date)}`}><button type="button" className="btn btn-primary ">Next</button></a>
      </div>
      
     <main>
      {!reservations.length ? <p>No reservations for this day.</p> : <table className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Date</th>
            <th>Time</th>
            <th>People</th>
          </tr>
        </thead>
        <tbody>{resList}</tbody>
      </table>}
      <ErrorAlert error={reservationsError} />
    </main>
    </>
   
  );
}

export default Dashboard;
