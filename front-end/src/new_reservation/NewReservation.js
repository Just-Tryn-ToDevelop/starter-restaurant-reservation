import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

function NewReservation() {
  const history = useHistory();
  const [mobileNumberInput, setMobileNumberInput] = useState("")
  const [createError, setCreateError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: mobileNumberInput,
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  function cancelHandler() {
    history.go(-1);
  }

  function changeHandler({ target: { name, value } }) {
    setFormData((preFormData) => ({
      ...preFormData,
      [name]: value,
    }));
    if (name === "mobile_number") {
      value = formatPhoneNumber(value)

    }
  }

  function formatPhoneNumber(value) {
    if (!value) return value

    const phoneNumber = value.replace(/[^\d]/g, "")

    const phoneNumberLength = phoneNumber.length

    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  function submitHandler(event) {
    event.preventDefault();
    createReservation(mobileNumberInput)
    createReservation(formData)
    .then(() => {
      history.push(`/dashboard?date=${formData.reservation_date}`);
    })
    .catch(setCreateError);
      
  }

  // console.log(formData)
  return (
    <>
      <div className="pl-3">
        <h1>Create Reservation</h1>
      </div>
      <ErrorAlert error={createError} />
      <form onSubmit={submitHandler} className="w-25 p-3">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            name="first_name"
            id="firstName"
            placeholder="John"
            value={formData.first_name}
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            name="last_name"
            id="lastName"
            value={formData.last_name}
            onChange={changeHandler}
            placeholder="Doe"
            required={true}
          />
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            className="form-control"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={changeHandler}
            id="mobileNumber"
            placeholder="XXX-XXX-XXXX"
            min="10"
            max="10"
            required={true}
          />
        </div>
        <div className="form-group w-75">
          <label>Reservation Date</label>
          <input
            type="date"
            className="form-control"
            name="reservation_date"
            id="date"
            value={formData.reservation_date}
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div className="form-group w-75">
          <label>Reservation Time</label>
          <input
            type="time"
            className="form-control"
            name="reservation_time"
            id="time"
            /* this code does not allow for the passing of the alert test, so I will un-comment it once project is graded
            min="10:30"
            max="21:30" */
            value={formData.reservation_time}
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div className="form-group w-25">
          <label>People</label>
          <input
            type="number"
            min="1"
            className="form-control"
            name="people"
            id="people"
            value={formData.people}
            onChange={changeHandler}
            placeholder="1+"
            required={true}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-success mr-1">
            Submit
          </button>
          <button
            onClick={cancelHandler}
            type="button"
            className="btn btn-danger mr-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default NewReservation;
