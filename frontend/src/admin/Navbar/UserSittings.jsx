import React, { useEffect, useState } from "react";
import { useUserContext } from "../../Global/UserProvider";
import { Link } from "react-router-dom";

function UserSittings() {
  const { user } = useUserContext();
  const [imageUrl, setImageUrl] = useState("img/avatar5.png");

  useEffect(() => {
    if (user && user.image) {
      setImageUrl(`http://localhost:8000/uploads/${user.image}`); // Replace .jpg with correct extension
    }
  }, [user]);

  return (
    <>
      <div className="content-wrapper">
        {/* <!-- Content Header (Page header) --> */}
        <section className="content-header">
          <div className="container-fluid my-2">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Profile</h1>
              </div>
              <div className="col-sm-6 text-right">
                <Link to="/admin" className="btn btn-primary">
                  back
                </Link>
              </div>
            </div>
          </div>
          {/* <!-- /.container-fluid --> */}
        </section>
        {/* <!-- Main content --> */}
        <section className="content">
          {/* <!-- Default box --> */}
          <div className="container-fluid ">
            <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center" style={{ gap: "15px" }}>
              <div
                className="shadow bg-white d-flex justify-content-center align-items-center"
                style={{
                  width: "100px",
                  height: "100px",
                  overflow: "hidden",
                  borderRadius: "50%",
                }}
              >
                <img className="w-100" src={imageUrl} alt="profile image" />
              </div>
              <div className="d-flex flex-column">
                <b>{user.name}</b>
                <small>{user.email}</small>
              </div>
            </div>
            <div className="d-flex align-items-cente" style={{ gap: "15px" }}>
              <button className="btn shadow py-1 px-2 rounded-lg rounded bg-white">
                <i className="fa fa-user"></i>{" "}
                <span className="text-dark">share</span>
              </button>
              <button className="btn bg-info py-1 px-2 rounded">
                view profile
              </button>
            </div>
            </div>

            {/* // inputs  */}
            <div className="row mt-2 justify-content-center">
              <div className="col-md-3 d-flex flex-column mt-4">
                <span className="text-bold">Personal info</span>
                <span className="">Update your profile info</span>
              </div>
              <div className="col-md-8 bg-white shadow p-4">
                  <div className="row">
                      <div className="form-group col-sm-6">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" value={user.name} className="form-control" />
                      </div>
                      <div className="form-group col-sm-6">
                        <label htmlFor="name" className="form-label">Contact</label>
                        <input type="text" className="form-control" value={'0300000000'} />
                      </div>
                  </div>

                 <div className="form-group">
                        <label htmlFor="name" className="form-label">Email</label>
                        <input type="text" className="form-control" value={user.email} />
                 </div>

                  <div className="d-flex align-items-top">
                    <div>
                      <img width={100} src={imageUrl} alt="" />
                    </div>
                    <div>
                      <input type="file" className="form" />
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-end" style={{gap:'4'}}>
                    <button className="btn shadow py-1 px-2">cancel</button>
                    <button className="btn btn-info py-1 px-2">Save Changes</button>

                  </div>
              </div>
            </div>
          </div>
          {/* <!-- /.card --> */}
        </section>
        {/* <!-- /.content --> */}
      </div>
    </>
  );
}

export default UserSittings;
