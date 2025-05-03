"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/Modal/LoadingPage";
import Sidebar from "@/components/Sidebar";
import iUser from "@/interface/userType";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

const AccountPage = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<iUser>();

  const { userId } = useUser();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/account/${username}`);
        setUser(res.data.user);
        setLoading(false);
      } catch (error: any) {
        setLoading(true);
        toast.error("Lấy dữ liệu thất bại! ", error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <>
      {user && userId && <Sidebar userInfo={user} id={userId} />}
      {loading && <LoadingPage isError={loading} />}
    </>
  );
};

export default AccountPage;
