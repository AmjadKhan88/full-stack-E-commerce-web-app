import React from 'react'
import './FooterIndex.js';

function Footer() {

  return (
    <>
    <footer className="bg-dark mt-5">
	<div className="container pb-5 pt-3">
		<div className="row">
			<div className="col-md-4">
				<div className="footer-card">
					<h3>Get In Touch</h3>
					<p>No dolore ipsum accusam no lorem. <br/>
					123 Street, New York, USA <br/>
					exampl@example.com <br/>
					000 000 0000</p>
				</div>
			</div>

			<div className="col-md-4">
				<div className="footer-card">
					<h3>Important Links</h3>
					<ul>
						<li><a href="about-us.php" title="About">About</a></li>
						<li><a href="contact-us.php" title="Contact Us">Contact Us</a></li>						
						<li><a href="#" title="Privacy">Privacy</a></li>
						<li><a href="#" title="Privacy">Terms & Conditions</a></li>
						<li><a href="#" title="Privacy">Refund Policy</a></li>
					</ul>
				</div>
			</div>

			<div className="col-md-4">
				<div className="footer-card">
					<h3>My Account</h3>
					<ul>
						<li><a href="#" title="Sell">Login</a></li>
						<li><a href="#" title="Advertise">Register</a></li>
						<li><a href="#" title="Contact Us">My Orders</a></li>						
					</ul>
				</div>
			</div>			
		</div>
	</div>
	<div className="copyright-area">
		<div className="container">
			<div className="row">
				<div className="col-12 mt-3">
					<div className="copy-right text-center">
						<p>© Copyright 2022 Amazing Shop. All Rights Reserved</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>
    </>
  )
}

export default Footer
