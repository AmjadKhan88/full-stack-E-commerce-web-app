import React from 'react'
import { Link } from 'react-router-dom'

function FrontOrders() {
  return (
    <>
      <main>
    <section className="section-5 pt-3 pb-3 mb-3 bg-white">
        <div className="container">
            <div className="light-font">
                <ol className="breadcrumb primary-color mb-0">
                    <li className="breadcrumb-item"><Link className="white-text" to="/my-account">My Account</Link></li>
                    <li className="breadcrumb-item">my-orders</li>
                </ol>
            </div>
        </div>
    </section>

    <section className=" section-11 ">
        <div className="container  mt-5">
            <div className="row">
                {/* <div className="col-md-3"> */}
                    {/* <?php include('includes/account-panel.php');?> */}
                {/* </div> */}
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="h5 mb-0 pt-2 pb-2">My Orders</h2>
                        </div>
                        <div className="card-body p-4">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead> 
                                        <tr>
                                            <th>Orders #</th>
                                            <th>Date Purchased</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Link to={`/my-account/order-detail/15`}>OR756374</Link>
                                            </td>
                                            <td>11 Nav, 2022</td>
                                            <td>
                                                <span className="badge bg-success">Delivered</span>
                                                
                                            </td>
                                            <td>$400</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="order-detail.php">OR756374</a>
                                            </td>
                                            <td>10 Oct, 2022</td>
                                            <td>
                                                <span className="badge bg-success">Delivered</span>
                                                
                                            </td>
                                            <td>$400</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="order-detail.php">OR756374</a>
                                            </td>
                                            <td>02 Sep, 2022</td>
                                            <td>
                                                <span className="badge bg-success">Delivered</span>
                                                
                                            </td>
                                            <td>$400</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="order-detail.php">OR756374</a>
                                            </td>
                                            <td>01 Dec, 2022</td>
                                            <td>
                                                <span className="badge bg-success">Delivered</span>
                                                
                                            </td>
                                            <td>$400</td>
                                        </tr>                                        
                                    </tbody>
                                </table>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
    </>
  )
}

export default FrontOrders
