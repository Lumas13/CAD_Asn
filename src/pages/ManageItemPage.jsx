import { useState, useEffect } from "react";
import "../css/ManageItemPage.css";

function ManageItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 5; 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('https://uot2hfc9sg.execute-api.us-east-1.amazonaws.com/dev/items');
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Update item details
  const handleUpdate = async (id, updates) => {
    try {
      const response = await fetch(`https://uot2hfc9sg.execute-api.us-east-1.amazonaws.com/dev/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setItems(
          items.map(item =>
            item.itemId === id ? { ...item, ...updates } : item
          )
        );
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Delete item 
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(`https://uot2hfc9sg.execute-api.us-east-1.amazonaws.com/dev/items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems(items.filter(item => item.itemId !== id));
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle input changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Save edits to the item
  const saveEdit = async () => {
    const { itemId, itemName, description, location, status, category } = currentEdit;
    const updates = { itemName, description, location, status, category };

    await handleUpdate(itemId, updates);

    setIsEditing(false);
    setCurrentEdit(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  ); 

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="manage-items-page">
      <h1>Manage Items</h1>
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Location</th>
                <th>Status</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.itemId}>
                  <td>{item.itemName}</td>
                  <td>{item.description}</td>
                  <td>{item.location}</td>
                  <td>{item.status}</td>
                  <td>{item.category}</td>
                  <td>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentEdit(item);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.itemId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination*/}
          <div className="pagination">
            <button
              className="arrow"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &#8592; 
            </button>
            {[...Array(totalPages).keys()].map(page => (
              <button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                className={currentPage === page + 1 ? "active" : ""}
              >
                {page + 1}
              </button>
            ))}
            <button
              className="arrow"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &#8594; 
            </button>
          </div>
        </>
      )}

      {isEditing && currentEdit && (
        <div className="edit-modal">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEdit();
            }}
          >
            <label>
              Item Name:
              <input
                type="text"
                name="itemName"
                value={currentEdit.itemName || ""}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={currentEdit.description || ""}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={currentEdit.location || ""}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Status:
              <select
                name="status"
                value={currentEdit.status || ""}
                onChange={handleInputChange}
                required
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </label>
            <label>
              Category:
              <select
                name="category"
                value={currentEdit.category || ""}
                onChange={handleInputChange}
                required
              >
                <option value="Accessories">Accessories</option>
                <option value="Electronics">Electronics</option>
                <option value="Utensils">Utensils</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageItemsPage;
