import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, TimePicker, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

function BookingPage() {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState();
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        `${window.location.origin}/api/v1/doctor/getDoctorById`,
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvailability = async () => {
    try {
      dispatch(showLoading);
      const res = await axios.post(
        `${window.location.origin}/api/v1/user/booking-availability`,
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading);
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        setIsAvailable(false);
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading);
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleBooking = async () => {
    try {
      if (!date && !time) {
        return alert("Date and Time Required");
      }
      dispatch(showLoading);
      const res = await axios.post(
        `${window.location.origin}/api/v1/user/book-appointment`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          date: date,
          userInfo: user,
          time: time,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading);
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading);
      console.log(error);
    }
  };

  return (
    <Layout>
      <h3 className="text-center p-3">Booking Page</h3>
      <div className="container">
        {doctor && (
          <div>
            <h4>
              Dr. {doctor.firstName} {doctor.lastName}
            </h4>
            <h4>Fees: {doctor.feesPerConsultation}</h4>
            <h4>
              Timings: {doctor.timings && doctor.timings[0]} -{" "}
              {doctor.timings && doctor.timings[1]}{" "}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  setDate(moment(value.$d).format("DD-MM-YYYY"));
                }}
              />
              <TimePicker
                className="m-2"
                format="HH:mm"
                onChange={(value) => {
                  setTime(moment(value.$d).format("HH:mm"));
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>
              {isAvailable && (
                <button
                  className="btn btn-primary mt-2 btn-dark"
                  onClick={handleBooking}
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BookingPage;
