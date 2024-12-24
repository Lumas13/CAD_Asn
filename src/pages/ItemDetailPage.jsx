import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/ItemDetailPage.css";

function ItemDetailPage() {
  const { id } = useParams(); 
  const [item, setItem] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`https://uot2hfc9sg.execute-api.us-east-1.amazonaws.com/dev/items/${id}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          console.error("Failed to fetch item details: ", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const getStatusText = () => {
    if (item.status === "Found") {
      return "This item has been found. If you are the owner, head down to the location.";
    }
    return "If this item has been found, please bring it to the location.";
  };

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="item-details">
      <div className="item-card">
        {/* Item image */}
        <div className="item-image">
        <img src={item.imageUrl} alt={item.itemName}/>
        </div>

        {/* Item name and status badge */}
        <div className="item-info">
          <div className="item-header">
            <h2 className="item-name">{item.itemName}</h2>
            <div className={`status-badge ${item.status === "Found" ? "found" : "lost"}`}>
            {item.status === "Lost" ? "Lost" : "Found"}
</div>

          </div>

          <p><strong>Description:</strong>{item.description}</p>
          <p><strong>Location:</strong> {item.location}</p>

          {/* Status message */}
          <p className="status-info">{getStatusText()}</p>

          <a href="/" className="back-btn">Back to Listings</a>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailPage;
