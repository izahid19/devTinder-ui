import { useEffect, useState } from "react";
import Curve from "../components/RouteAnimation/Curve";
import { BASE_URL } from "../utils/config";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "../components/UserCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.feed);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/feed`, {
        credentials: "include",
      });
      const data = await response.json();
      dispatch(addFeed(data.users));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Curve>
      <div className="flex justify-center mt-20">
        {loading ? (
          <p>Loading...</p>
        ) : users && users.length > 0 ? (
          <UserCard user={users[0]} />
        ) : (
          <p className="text-gray-500">No New Users Available</p>
        )}
      </div>
    </Curve>
  );
};

export default HomePage;
