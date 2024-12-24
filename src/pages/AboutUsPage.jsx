import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "../css/AboutUsPage.css";

function AboutUsPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      setMessage("Please enter a valid email.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://uot2hfc9sg.execute-api.us-east-1.amazonaws.com/dev/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Successfully subscribed to notifications! Please check your email to confirm.");
        setIsSubscribed(true);
      } else {
        setMessage(result.message || "Failed to subscribe.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setMessage("There was an error subscribing.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <div className="hero">
        <h1>About Us</h1>
      </div>

      {/* Divider Section */}
      <div className="divider">
        <div className="about-content">
          <div className="text-content">
            <h2>Welcome to the Nanyang Polytechnic Lost & Found</h2>
            <p>
              At NYP, we believe in promoting community-driven initiatives. Our Lost & Found platform allows both students and staff to add items they find or lose, making it easier for everyone to reconnect with their belongings.
            </p>
            <p>
              This platform serves as a teaching initiative where users can engage in helping one another while learning about technology, responsibility, and community spirit.
            </p>
          </div>
          <div className="image-content">
            <img src="/AboutUs.jpeg" alt="About Us" />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <p>
            <i><FaEnvelope /></i>
            <strong>Email:</strong> lostandfound@nyp.edu.sg
          </p>
          <p>
            <i><FaPhone /></i>
            <strong>Phone:</strong> +65 1234 5678
          </p>
          <p>
            <i><FaMapMarkerAlt /></i>
            <strong>Location:</strong> Nanyang Polytechnic, Blk B, 1st Floor
          </p>
        </div>

        {/* Call to Action */}
        <div className="cta">
          <p>If youve found or lost an item, dont hesitate to <Link to="/AddItem">report it here</Link>!</p>
        </div>
      </div>

      {/* Email Subscription Form */}
      <div className="email-subscription">
        <h2>Lost an Item? Subscribe Here to Get the Latest News</h2>
        <p>Stay updated with the latest items listed in our Lost & Found section by subscribing to our notifications.</p>
        
        {!isSubscribed ? (
          <form onSubmit={handleEmailSubmit} className="subscription-form">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        ) : (
          <div className="confirmation-message">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AboutUsPage;
