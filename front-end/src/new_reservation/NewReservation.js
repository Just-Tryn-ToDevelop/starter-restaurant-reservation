import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "../layout/ReservationForm";

function NewReservation() {
  const history = useHistory();
  const [createError, setCreateError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
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
      status: "booked",
    }));
    if (name === "mobile_number") {
      value = formatPhoneNumber(value);
    }
    if (name === "people") value = Number(value);
  }

  function formatPhoneNumber(value) {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");

    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7)
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
      await createReservation(formData);
      await history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setCreateError(error);
    }
  }
  return (
    <>
      <div className="pl-3 ">
        <h1>Create Reservation</h1>
      </div>
      <ErrorAlert error={createError} />
      <ReservationForm
        formData={formData}
        createSubmitHandler={submitHandler}
        changeHandler={changeHandler}
        cancelHandler={cancelHandler}
      />
    </>
  );
}

export default NewReservation;
