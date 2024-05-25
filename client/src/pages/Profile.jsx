import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";


const Profile = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  console.log(file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      console.log(formData);
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        dispatch(updateUserFailure(data.error))
        return;
      }
      dispatch(updateUserSuccess(data.user))
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signOut',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
      });
      const data = await res.json();
      if(data.error){
        dispatch(updateUserFailure(data.error))
        return;
      }
      dispatch(signOutUserSuccess(data.message))
    } catch (error) {
      dispatch(signOutUserFailure(error))
    }

  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch('/api/user/delete',{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
      });
      const data = await res.json();
      if(data.error){
        dispatch(deleteUserFailure(data.error))
        return;
      }
      dispatch(deleteUserSuccess(data.message))
    } catch (error) {
      dispatch(deleteUserFailure(error))
    }
  }
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const { currentUser, loading } = useSelector((state) => state.user);
  return (
    <div className="flex justify-center ">
      <div className="p-3  w-96">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            // onClick={() => fileRef.current.click()}
            src={currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            id="email"
            defaultValue={currentUser.email}
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            onChange={handleChange}
            id="password"
            className="border p-3 rounded-lg"
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <Link
            className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
            to={"/create-listing"}
          >
            Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-5">
          <span onClick={handleDelete} className="text-red-700 cursor-pointer">
            Delete account
          </span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
            Sign out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
