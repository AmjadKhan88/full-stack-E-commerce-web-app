import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Global/UserProvider";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";

function UserAccount() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState(''); // State to hold phone number
  
  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchAddressSuggestions = async (query) => {
    if (query.length > 3) {
      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=YOUR_API_KEY`
        );
        setSuggestions(response.data.features);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    fetchAddressSuggestions(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.properties.formatted);
    setSuggestions([]);
  };

  // getUserData
  const UserData = async () => {
    setPageLoading(true);
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/userFetch/${token}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        const user = response.data.user;
        setValue('name', user.name);
        setValue('email', user.email);
        setPhone(user.phone); // Set the phone number in state
        setValue('address', user.address);
        setUserId(user.id);
        setPageLoading(false);
      }
    } catch (error) {
      console.log(error);
      setPageLoading(false);
    }
  };

  // Submit form data
  const onSubmit = async (data) => {
    setLoader(true);
    const token = localStorage.getItem("userToken");
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append("phone", phone); // Append phone to form data

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/update/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Include cookies in the request
        }
      );

      if (response.status === 201) {
        console.log(response.data.message);
        setLoader(false);
        navigate("/");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setLoader(false);
    }
  };

  useEffect(() => {
    UserData();
  }, []);

  return (
    <>
      <main>
        <section className="section-5 pt-3 pb-3 mb-3 bg-white">
          <div className="container">
            <div className="light-font">
              <ol className="breadcrumb primary-color mb-0">
                <li className="breadcrumb-item">
                  <a className="white-text" href="#">
                    My Account
                  </a>
                </li>
                <li className="breadcrumb-item">Profile</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="section-11">
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-3">{/* Account panel can go here */}</div>
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h2 className="h5 mb-0 pt-2 pb-2">Personal Information</h2>
                  </div>
                  <div className="card-body p-4">
                    {pageLoading ? 'Loading...' :
                      <div className="row">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="mb-3">
                            <label htmlFor="name">Name</label>
                            <input
                              {...register("name")}
                              placeholder="Enter Your Name"
                              className="form-control"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                              type="text"
                              {...register("email")}
                              placeholder="Enter Your Email"
                              className="form-control"
                            />
                          </div>

                          {/* Phone input field with react-phone-input-2 */}
                          <div className="mb-3">
                            <label htmlFor="phone">Phone</label>
                            <PhoneInput
                              country={"us"}
                              value={phone} // Use phone state
                              onChange={(phone) => setPhone(phone)} // Update phone state on change
                              inputClass="form-control"
                              placeholder="Enter Your Phone Number"
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="address">Address</label>
                            <textarea
                              {...register("address")}
                              className="form-control"
                              cols="30"
                              rows="5"
                              placeholder="Enter Your Address"
                            ></textarea>

                            {/* Display address suggestions */}
                            {suggestions.length > 0 && (
                              <ul className="list-group mt-2">
                                {suggestions.map((suggestion, index) => (
                                  <li
                                    key={index}
                                    className="list-group-item list-group-item-action"
                                    onClick={() =>
                                      handleSuggestionClick(suggestion)
                                    }
                                  >
                                    {suggestion.properties.formatted}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="d-flex">
                            <button type="submit" disabled={loader} className="btn btn-dark">
                              {loader ? (
                                <div className="spinner-border" role="status">
                                  <span className="sr-only">Loading...</span>
                                </div>
                              ) : (
                                "Update"
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default UserAccount;
