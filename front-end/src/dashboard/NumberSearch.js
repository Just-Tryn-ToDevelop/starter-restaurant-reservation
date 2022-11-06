import React, { useState } from "react";
import { Link } from "react-router-dom";
import { listReservations, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";

function NumberSearch() {
  const [reservations, setReservations] = useState([]);
  const [numberError, setNumberError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState({
    mobile_number: "",
  });

  const [submit, setSubmit] = useState(false);

  const queryParams = useQuery();
  const queryNumber = queryParams.get("mobile_number");
  if (queryNumber) setPhoneNumber(queryNumber);

  function changeHandler({ target: { name, value } }) {
    setPhoneNumber((prePhoneNumber) => ({
      ...prePhoneNumber,
      [name]: value,
    }));
  }

  function cancelHandler(e) {
    const { value } = e.target;
    const reservation = reservations.find(
      (reservation) => reservation.reservation_id === Number(value)
    );
    const warningMessage = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (warningMessage) {
      reservation.status = "cancelled";
      updateReservation(reservation)
            .then(setReservations([...reservations]))
        .catch(setNumberError);
    }
  }

  function submitHandler(e) {
    e.preventDefault();
    listReservations(phoneNumber).then(setReservations).catch(setNumberError);
    setSubmit(true);
  }

  const searchResults = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
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
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
              <button
                className="dropdown-item"
                value={reservation.reservation_id}
                onClick={cancelHandler}
                data-reservation-id-cancel={reservation.reservation_id}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </td>
    </tr>
  ));
  return (
    <>
      <main>
        <ErrorAlert error={numberError} />
        <form onSubmit={submitHandler}>
          <div className="row m-3" style={{ justifyContent: "center" }}>
            <div className="col-md-9 col-12 border pt-3">
              <h4 className="text-center mb-3">Search By Mobile Number</h4>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <button className="btn btn-warning" type="submit">
                    Find
                  </button>
                </div>
                <input
                  type="text"
                  name="mobile_number"
                  value={phoneNumber.mobile_number}
                  onChange={changeHandler}
                  className="form-control"
                  placeholder="Enter a customer's phone Number"
                />
              </div>
              {submit === true ? (
                !searchResults.length ? (
                  <p>No reservations found</p>
                ) : (
                  <>
                  <div className="row m-3" style={{ justifyContent: "center" }}>
            <div className="col-md-9 col-12  pt-3"></div>
                    <table className="table table-responsive-xl">
                      <thead className="border table-dark">
                        <tr>
                          <th>First</th>
                          <th>Last</th>
                          <th>Mobile</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>People</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>{searchResults}</tbody>
                    </table>
                    </div>
                  </>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

export default NumberSearch;
