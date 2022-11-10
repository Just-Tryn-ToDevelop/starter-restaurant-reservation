import React, { useState, useEffect } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import { editReservation, readReservation } from "../utils/api";
import ReservationForm from "../layout/ReservationForm";

function EditReservation() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });
  const [createError, setCreateError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!reservation_id) return;
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal).then(setFormData);
    return () => abortController.abort();
  }, [reservation_id]);

  function cancelHandler() {
    history.go(-1);
  }

  function changeHandler({ target: { name, value } }) {
    setFormData((preFormData) => ({
      ...preFormData,
      [name]: value,
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
      await editReservation(formData);
      await history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setCreateError(error);
    }
  }

  return (
    <>
      <ErrorAlert error={createError} />
      <ReservationForm
        editSubmitHandler={submitHandler}
        cancelHandler={cancelHandler}
        changeHandler={changeHandler}
        formData={formData}
        resId={reservation_id}
      />
    </>
  );
}

export default EditReservation;
