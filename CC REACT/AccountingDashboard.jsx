import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AccountingContext } from './AccountingContext';
import './AccountingDashboard.css';
import BarChart from './BarChart'; 
import { useNavigate } from 'react-router-dom';

const AccountingDashboard = ({ phoneNumber }) => {
  const { activeSection, setActiveSection, items, setItems, finalResult, setFinalResult } = useContext(AccountingContext);
  const [editItem, setEditItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // Date state
  const [totalForDate, setTotalForDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [formData, setFormData] = useState({ productName: '', quantity: '', amount: '' });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // Added to manage popup visibility
  useEffect(() => {
    const fetchUser = async () => {
      // const identifier = '123'; 
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/users?phoneNumber=${phoneNumber}`);
        if (response.data.length > 0) {
          const fetchedUser = response.data[0];
          setUser(fetchedUser);
        } else {
          console.error('User not found');
          navigate('/login');
        }
      } catch (error) {
        console.error(phoneNumber);
        console.error('Error fetching user:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate,phoneNumber]);
  useEffect(() => {
    const fetchData = async () => {
      if (activeSection === 'finalResult') {
        return;
      }

      if (activeSection === 'accbook') {
        try {
          const [purchases, sales, credits] = await Promise.all([
            axios.get(`http://localhost:3000/purchases`),
            axios.get(`http://localhost:3000/sales`),
            axios.get(`http://localhost:3000/credits`)
          ]);

          setItems({
            purchases: purchases.data,
            sales: sales.data,
            credits: credits.data,
          });
        } catch (error) {
          console.error('Error fetching account book data:', error.response?.data?.message || error.message);
        }
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/${activeSection}`);
        setItems((prevItems) => ({ ...prevItems, [activeSection]: response.data }));
      } catch (error) {
        console.error(`Error fetching ${activeSection}:`, error.response?.data?.message || error.message);
      }
    };

    fetchData();
    setFormData({ productName: '', quantity: '', amount: '' });
    setEditItem(null);
  }, [activeSection, setItems]);

  useEffect(() => {
    // Fetch all available dates from the database
    const fetchDates = async () => {
      try {
        const response = await axios.get('http://localhost:3000/date');
        setAvailableDates(response.data);
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    };

    fetchDates();
  }, []);

  const handleDateChange = async (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);

    // Fetch totalAmount for the selected date
    try {
        const response = await axios.get(`http://localhost:3000/date?date=${selected}`);
        if (response.data.length > 0) {
            setTotalForDate(response.data[0].totalAmount); // Ensure totalAmount is set
        } else {
            setTotalForDate('No data exists');
        }
    } catch (error) {
        console.error('Error fetching total for date:', error);
    }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleAddItem = async (e) => {
    e.preventDefault();
    const { productName, quantity, amount } = formData;
    const total = parseFloat(quantity) * parseFloat(amount);

    try {
        // Check if the item already exists in the current section
        const existingItem = items[activeSection]?.find(
            (item) => item.productName === productName && item.amount === amount
        );

        if (existingItem) {
            // If the item exists, merge by updating the quantity and total
            const updatedQuantity = parseFloat(existingItem.quantity) + parseFloat(quantity);
            const updatedTotal = updatedQuantity * parseFloat(amount);

            // Update the item in the database
            await axios.put(`http://localhost:3000/${activeSection}/${existingItem.id}`, {
                ...existingItem,
                quantity: updatedQuantity,
                total: updatedTotal
            });

            // Also update the item in the 'accbook'
            await axios.put(`http://localhost:3000/accbook/${existingItem.id}`, {
                ...existingItem,
                quantity: updatedQuantity,
                total: updatedTotal
            });

            // Update the state with the new values
            setItems((prevItems) => ({
                ...prevItems,
                [activeSection]: prevItems[activeSection].map((item) =>
                    item.id === existingItem.id ? { ...item, quantity: updatedQuantity, total: updatedTotal } : item
                ),
            }));
        } else {
            // If the item does not exist, create a new one
            const response = await axios.post(`http://localhost:3000/${activeSection}`, {
                productName,
                quantity,
                amount,
                total
            });

            await axios.post(`http://localhost:3000/accbook`, {
                productName,
                quantity,
                amount,
                total
            });

            // Add the new item to the state
            setItems((prevItems) => ({
                ...prevItems,
                [activeSection]: [...prevItems[activeSection], { ...response.data }],
            }));
        }

        // Reset the form fields after the operation (whether updating or adding)
        setFormData({ productName: '', quantity: '', amount: '' });
        setFinalResult(null);
    } catch (error) {
        console.error(`Error adding ${activeSection} item:`, error.response?.data?.message || error.message);
    } finally {
        // Ensure that the form fields are cleared after the operation is completed
        setFormData({ productName: '', quantity: '', amount: '' });
    }
};

  const handleEditItem = async (e) => {
    e.preventDefault();
    const { productName, quantity, amount } = formData;
    const total = parseFloat(quantity) * parseFloat(amount);
  
    if (!editItem || !editItem.id) {
      console.error("No edit item or ID available");
      return;
    }
  
    // Determine the correct endpoint based on activeSection
    
    const endpoint = activeSection;
    try {
      const response = await axios.put(`http://localhost:3000/${endpoint}/${editItem.id}`, {
        productName,
        quantity,
        amount,
        total
      });
  
      // Update the local state
      setItems((prevItems) => ({
        ...prevItems,
        [endpoint]: prevItems[endpoint].map((item) =>
          item.id === editItem.id ? { ...response.data } : item
        )
      }));
  
      closePopup(); // Close the popup after updating
      setFinalResult(null);
    } catch (error) {
      console.error(`Error updating ${activeSection} item:`, error.response?.data?.message || error.message);
    }
  };
  
  const openPopup = (item) => {
    setEditItem(item);
    setFormData({
      productName: item.productName,
      quantity: item.quantity,
      amount: item.amount
    });
    setShowPopup(true); // Show the popup form
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditItem(null);
    setFormData({ productName: '', quantity: '', amount: '' });
  };

  const handleDeleteItem = async (id) => {
    console.log("Deleting item with ID:", id); // Log the ID
    try {
        const endpoint = activeSection;
        await axios.delete(`http://localhost:3000/accbook/${id}`); // Correct endpoint
        setItems((prevItems) => ({
            ...prevItems,
            [endpoint]: prevItems[endpoint].filter(item => item.id !== id), // Update the correct section
        }));
        setFinalResult(null);
    } catch (error) {
        console.error(`Error deleting ${activeSection} item:`, error.response?.data?.message || error.message);
    }
};

  

  

const calculateFinalResult = async () => {
    const totalPurchases = items.purchases?.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0) || 0;
    const totalSales = items.sales?.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0) || 0;
    const totalCredits = items.credits?.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0) || 0;

    const result = totalSales - totalPurchases - totalCredits;
    const currentDate = new Date().toISOString().slice(0, 10);
    
    try {
        // Check if the date entry already exists
        const existingDateResponse = await axios.get(`http://localhost:3000/date?date=${currentDate}`);
        
        if (existingDateResponse.data.length > 0) {
            // If it exists, update the total amount
            await axios.put(`http://localhost:3000/date/${existingDateResponse.data[0].id}`, {
                date: currentDate,
                totalAmount: result
            });
        } else {
            // If it doesn't exist, create a new entry
            await axios.post(`http://localhost:3000/date`, {
                date: currentDate,
                totalAmount: result
            });
        }
    } catch (error) {
        console.error("Error updating date and total result:", error.response?.data?.message || error.message);
    }
    
    setFinalResult(result);
};



  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {loading && <div className="loading">Loading...</div>}
      
      <nav className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'accbook' ? 'active' : ''} onClick={() => {setActiveSection('accbook')}}>AccountBook</li>
          <li className={activeSection === 'purchases' ? 'active' : ''} onClick={() => setActiveSection('purchases')}>Purchases</li>
          <li className={activeSection === 'sales' ? 'active' : ''} onClick={() => setActiveSection('sales')}>Sales</li>
          <li className={activeSection === 'credits' ? 'active' : ''} onClick={() => setActiveSection('credits')}>Credits</li>
          <li className={activeSection === 'finalResult' ? 'active' : ''} onClick={() => setActiveSection('finalResult')}>Today's Total</li>
          <li className={activeSection === 'chart' ? 'active' : ''} onClick={() => setActiveSection('chart')}>Business Chart</li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>
  
      <div className="main-content">
        <h1>Welcome {user?.username}</h1>
        <h1>Vyaapar Dashboard</h1>  
        
        <div className="accordion">
          <div className="accordion-item">
            <div className="accordion-header">
              <h2>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
            </div>
  
            <div className="accordion-content">
              {activeSection === 'accbook' && (
                <div className="account-book">
                  <h2>AccountBook</h2>
                  <label htmlFor="datePicker">Select Date:</label>
                  <select id="datePicker" value={selectedDate} onChange={handleDateChange}>
                    <option value="">--Select Date--</option>
                    {availableDates.map((dateEntry) => (
                      <option key={dateEntry.id} value={dateEntry.date}>
                      {dateEntry.date}
                    </option>
                    ))}
                    </select>

                    <div className="total-amount-display">
                      <h3>Total for Selected Date: {totalForDate !== null ? `$${totalForDate}` : 'N/A'}</h3>
                    </div>
                  <h3>Purchases</h3>
                  <ul>
                    {items.purchases.map(item => (
                      <li key={item.id}>
                        {item.productName}: {item.quantity} x ${parseFloat(item.amount).toFixed(2)} = ${parseFloat(item.total).toFixed(2)}
                        <button className="editaccbook" onClick={() => openPopup(item)}>Edit</button>
                        <button className="deleteaccbook" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                      </li>
                    ))}
                  </ul>
  
                  <h3>Sales</h3>
                  <ul>
                    {items.sales.map(item => (
                      <li key={item.id}>
                        {item.productName}: {item.quantity} x ${parseFloat(item.amount).toFixed(2)} = ${parseFloat(item.total).toFixed(2)}
                        <button className="editaccbook" onClick={() => openPopup(item)}>Edit</button>
                        <button className="deleteaccbook" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                      </li>
                    ))}
                  </ul>
  
                  <h3>Credits</h3>
                  <ul>
                    {items.credits.map(item => (
                      <li key={item.id}>
                        {item.productName}: {item.quantity} x ${parseFloat(item.amount).toFixed(2)} = ${parseFloat(item.total).toFixed(2)}
                        <button className="editaccbook" onClick={() => openPopup(item)}>Edit</button>
                        <button className="deleteaccbook" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
  
              {(activeSection === 'purchases' || activeSection === 'sales' || activeSection === 'credits') && (
                <form onSubmit={editItem ? handleEditItem : handleAddItem}>
                  <h2>{editItem ? 'Edit' : 'Add'} {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
                  <input className='input-field' type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleInputChange} required />
                  <input className='input-field' type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleInputChange} required />
                  <input className='input-field' type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
                  <button className='submit-button' type="submit">{editItem ? 'Update' : 'Add'}</button>
                </form>
              )}

              {activeSection=== 'chart' && 
                <BarChart/>}

              {activeSection === 'finalResult' && (
                <div className="final-result">
                  <h2>Today's Total: ${finalResult ? finalResult.toFixed(2) : 'N/A'}</h2>
                  <button className='submit-button' onClick={calculateFinalResult}>Calculate</button>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>Edit Item</h2>
              <form onSubmit={handleEditItem}>
                <input className='input-field' type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleInputChange} required />
                <input className='input-field' type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleInputChange} required />
                <input className='input-field' type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
                <button className='submit-button' type="submit">Update</button>
                <button className='submit-button' type="button" onClick={closePopup}>Cancel</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AccountingDashboard;
