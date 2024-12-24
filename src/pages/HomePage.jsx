import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 12; 

  // Fetch items from the API on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('https://uot2hfc9sg.execute-api.us-east-1.amazonaws.com/dev/items');
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    return (
      (categoryFilter === "All" || item.category === categoryFilter) &&
      (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero">
        <h1>Lost & Found</h1>
      </div>

      {/* Divider Section for Search and Filter */}
      <div className="divider">
        <div className="search-filter-section">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Accessories">Accessories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Musical Instrument">Musical Instruments</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Lost Items Section */}
      <div className="lost-items-section">
        <h2>Lost Items</h2>
        {loading ? (
          <p>Loading items...</p>
        ) : (
          <>
            <div className="lost-items-cards">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <Link to={`/item/${item.itemId}`} key={item.itemId} className="lost-item-card">
                    <img src={item.imageUrl} alt={item.itemName} className="item-image" />
                    <div className="card-content">
                      <h3>{item.itemName}</h3>
                      <p><strong>Description:</strong>{item.description}</p>
                      <p><strong>Last Seen Location:</strong> {item.location}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No items found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="arrow">
                &#8592; 
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="arrow">
                &#8594; 
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
