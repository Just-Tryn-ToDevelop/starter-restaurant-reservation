function ReservationForm({formData, cancelHandler, changeHandler, createSubmitHandler, editSubmitHandler, resId}) {

  return (
        <>
        <form onSubmit={!resId ? createSubmitHandler : editSubmitHandler} className="w-75 p-3">
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
          <label>Last Name</label>
        <div className="form-group">
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
    )
}

export default ReservationForm