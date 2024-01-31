import React from "react";
import "../styles/LayoutStyles.css";
import Layout from "../components/Layout";
import { Tabs, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NotificationPage() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading);
      const res = await axios.post(
        `${window.location.origin}/api/v1/user/get-all-notification`,
        {
          userId: user._id,
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
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading);
      console.log(error);
      message.error("something went wrong to get all notifications");
    }
  };
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading);
      const res = await axios.post(
        `${window.location.origin}/api/v1/user/delete-all-notification`,
        {
          userId: user._id,
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
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading);
      console.log(error);
      message.error("something went wrong to delete all notifications");
    }
  };

  return (
    <Layout>
      <div>
        <h4 className="p-3 text-center">Notification Page</h4>
        <Tabs>
          <Tabs.TabPane tab="unRead" key={0}>
            <div className="d-flex justify-content-end">
              <h4 className="p-2" onClick={handleMarkAllRead}>
                Mark All Read
              </h4>
            </div>
            {user?.notification.map((notificationMsg) => (
              <div className="card">
                <div
                  className="card-text"
                  onClick={() => navigate(notificationMsg.onClickPath)}
                >
                  {notificationMsg.message}
                </div>
              </div>
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Read" key={1}>
            <div className="d-flex justify-content-end p-3">
              <h4 className="p-2 text-primary" onClick={handleDeleteAllRead}>
                Delete All Read
              </h4>
            </div>
            {user?.seennotification.map((notificationMsg) => (
              <div className="card">
                <div
                  className="card-text"
                  onClick={() => navigate(notificationMsg.onClickPath)}
                >
                  {notificationMsg.message}
                </div>
              </div>
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Layout>
  );
}

export default NotificationPage;
