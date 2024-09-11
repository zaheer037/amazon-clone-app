import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this is imported to apply CSS
import Swal from 'sweetalert2';

function App() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Home & Kitchen' },
    { id: 4, name: 'Beauty & Personal Care' }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addItemForm, setAddItemForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [registerForm, setRegisterForm] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemImage, setEditItemImage] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // Added for managing the current user

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    fetchItems(category.name);
  };

  const fetchItems = async (categoryName) => {
    try {
      const response = await axios.get(`http://localhost:4000/items/${categoryName}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = () => {
    setAddItemForm(true);
  };

  const handleSaveItem = async () => {
    try {
      const response = await axios.post('http://localhost:4000/items', {
        name: itemName,
        price: itemPrice,
        image: itemImage,
        category: selectedCategory.name
      });
      setItems([...items, response.data.item]);
      setAddItemForm(false);
      setItemName('');
      setItemPrice('');
      setItemImage('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = (index) => {
    const itemToEdit = items[index];
    setEditItemIndex(index);
    setEditItemName(itemToEdit.name);
    setEditItemPrice(itemToEdit.price);
    setEditItemImage(itemToEdit.image);
  };

  const handleSaveEditItem = () => {
    const updatedItems = [...items];
    updatedItems[editItemIndex] = {
      ...updatedItems[editItemIndex],
      name: editItemName,
      price: editItemPrice,
      image: editItemImage
    };
    setItems(updatedItems);
    setEditItemIndex(null);
    setEditItemName('');
    setEditItemPrice('');
    setEditItemImage('');
  };

  const handleCancelEdit = () => {
    setEditItemIndex(null);
    setEditItemName('');
    setEditItemPrice('');
    setEditItemImage('');
  };

  const handleAddToCart = async (item) => {
    try {
      const response = await axios.post('http://localhost:4000/cart', {
        userId: currentUser._id,
        items: [item]
      });
      setCartItems([...cartItems, item]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = async () => {
    try {
      // Step 1: Check if user is logged in
      if (!currentUser || !currentUser._id) {
        console.error('User is not logged in');
        return;
      }
      // Step 2: Send the request to complete the purchase
      const response = await axios.post('http://localhost:4000/buy', { userId: currentUser._id });
      // Step 3: Display the success message and reset states
      setOrderMessage(`Hooray!! Your order for ${cartItems.length} items has been placed! 🎉`);
      // Step 4: Clear the cart in the frontend
      setCartItems([]);
      // Step 5: Reset the selected category to default after purchase
      setSelectedCategory(null);
      // Step 6: Optionally, remove the success message after 3 seconds
      setTimeout(() => {
        setOrderMessage(null);
      }, 3000);
    } catch (error) {
      // Step 7: Error handling with a custom error message or alert
      console.error('Error during purchase:', error);
      // You can also set an error message to display in the UI
      setOrderMessage('Oops! Something went wrong. Please try again.');
      // Optionally, remove the error message after 3 seconds
      setTimeout(() => {
        setOrderMessage(null);
      }, 3000);
    }
  };
  
  const handleRegisterSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:4000/register', {
        username,
        email,
        phone,
        password
      });
      setRegisterForm(false);
      setLoginForm(true);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password
      });
      setCurrentUser(response.data.user);
      setLoggedIn(true);
      setLoginForm(false);
    } catch (error) {
      console.error('Error during login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Incorrect username or password. Please try again.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        background: '#f2f2f2',
        backdrop: `rgba(0, 0, 0, 0.4)`,
        customClass: {
          popup: 'styled-alert-popup', // Optional: Add custom styles using CSS
        },
      });
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    setRegisterForm(false);
    setLoginForm(false);
  };

  const handleHomeClick = () => {
    if (loggedIn) {
      setSelectedCategory(null);
    } else {
      setRegisterForm(false);
      setLoginForm(false);
    }
  };

  return (
    <div className="app">
      <Header1
       onHomeClick={handleHomeClick}
       onRegisterClick={() => setRegisterForm(true)}
       isLoggedIn={loggedIn}
       onLogout={handleLogout}
       onLoginClick={() => setLoginForm(true)}
       />
      <Header
        onHomeClick={handleHomeClick}
        onRegisterClick={() => setRegisterForm(true)}
        isLoggedIn={loggedIn}
        onLogout={handleLogout}
        onLoginClick={() => setLoginForm(true)}
      />
      <main>
        <h2>Welcome to Mini Amazon</h2>
        <p>A mini store where you can add any item details from any website and can buy here</p>
        {registerForm ? (
          <div className="form-container">
            <h2>Register</h2>
            <form>
              <label>Name:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              <br />
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <br />
              <label>Phone:</label>
              <input type="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <br />
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <br />
              <button type="button" onClick={handleRegisterSubmit}>Register</button>
            </form>
          </div>
        ) : loginForm ? (
          <div className="form-container">
            <h2>Login</h2>
            <form>
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <br />
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <br />
              <button type="button" onClick={handleLoginSubmit}>Login</button>
            </form>
          </div>
        ) : loggedIn ? (
          <div className="category-container">
            <h2>Categories</h2>
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category.id}>
                  <a href="#" onClick={() => handleSelectCategory(category)}>
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
            {selectedCategory && (
              <div className="selected-category">
                <h2>{selectedCategory.name}</h2>
                <button className="add-item-btn" onClick={handleAddItem}>Click here to add items</button>
                {addItemForm && (
                  <div className="form-container">
                    <label>Item Name:</label>
                    <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                    <br />
                    <label>Item Price:</label>
                    <input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
                    <br />
                    <label>Item Image URL:</label>
                    <input type="text" value={itemImage} onChange={(e) => setItemImage(e.target.value)} />
                    <br />
                    <button onClick={handleSaveItem}>Save Item</button>
                  </div>
                )}
                <ul className="item-list">
                  {items.filter((item) => item.category === selectedCategory.name).map((item, index) => (
                    <li key={index}>
                      <img src={item.image} alt={item.name} />
                      <p>{item.name}</p>
                      <p>Price: {item.price}</p>
                      {editItemIndex === index ? (
                        <div>
                          <input
                            type="text"
                            value={editItemName}
                            onChange={(e) => setEditItemName(e.target.value)}
                          />
                          <input
                            type="text"
                            value={editItemPrice}
                            onChange={(e) => setEditItemPrice(e.target.value)}
                          />
                          <input
                            type="text"
                            value={editItemImage}
                            onChange={(e) => setEditItemImage(e.target.value)}
                          />
                          <button onClick={handleSaveEditItem}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      ) : (
                        <div>
                          <span style={{padding:"20px"}}><button onClick={() => handleEditItem(index)}>Edit</button></span>
                          <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {cartItems.length > 0 && (
                  <div className="cart-container">
                    <h2>Cart</h2>
                    <ol>
                      {cartItems.map((item, index) => (
                        <li key={index} style={{listStyle:"none"}}>
                          <img src={item.image} alt={item.name} />
                          <p>{item.name}</p>
                          <p>Price: {item.price}</p>
                          <hr/>
                        </li>
                      
                      ))}
                    </ol>
                    <button onClick={handleBuyNow}>Buy Now</button>
                  </div>
                )}
              </div>
            )}
            {orderMessage && (
              <div className="order-message">{orderMessage}</div>
            )}
          </div>
        ) : null}
      </main>
      <Footer/>
    </div>
  );
}

const Header1 = ({ onHomeClick, onRegisterClick, isLoggedIn, onLogout, onLoginClick }) => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className="logo" />
      </div>
      <nav>
        <ul className="nav-list">
          <li><a href="#" onClick={onHomeClick} style={{textDecoration:"none"}}>Home</a></li>
          {!isLoggedIn && <li><a href="#" onClick={onRegisterClick} style={{textDecoration:"none"}}>Register</a></li>}
          {!isLoggedIn && <li><a href="#" onClick={onLoginClick} style={{textDecoration:"none"}}>Login</a></li>}
          {isLoggedIn && <li><a href="#" onClick={onLogout} style={{textDecoration:"none"}}>Logout</a></li>}
          <li><a href="#" style={{textDecoration:"none"}}>About</a></li>
          <li><a href="#" style={{textDecoration:"none"}}>Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

function Header({ onHomeClick, onRegisterClick, isLoggedIn, onLogout, onLoginClick }) {
  return (
    <header>
      <h1 onClick={onHomeClick}>Mini Amazon</h1>
      <div className="header-links">
        {!isLoggedIn && (
          <>
            <span style={{padding:"20px"}}><button onClick={onRegisterClick}>Register</button></span>
            <button onClick={onLoginClick}>Login</button>
          </>
        )}
        {isLoggedIn && <button onClick={onLogout}>Logout</button>}
      </div>
    </header>
  );
}

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <button className="back-to-top"><a href='#' style={{textDecoration:"none", color:"white"}}>Back to top</a></button>
      </div>
      <div className="footer-links">
        <div>
          <h5>Get to Know Us</h5>
          <ul>
            <li><a href="#"><i class="fa fa-info-circle" aria-hidden="true"></i>  About Us</a></li>
            <li><a href="#"><i class="fa fa-graduation-cap" aria-hidden="true"></i>  Careers</a></li>
            <li><a href="#"><i class="fa fa-newspaper-o" aria-hidden="true"></i>  Press Releases</a></li>
            <li><a href="#"><i class="fa fa-amazon" aria-hidden="true"></i>  Amazon Science</a></li>
          </ul>
        </div>
        <div>
          <h5>Make Money with Us</h5>
          <ul>
            <li><a href="#"><i class="fa fa-bullhorn" aria-hidden="true"></i>  Sell on Amazon</a></li>
            <li><a href="#"><i class="fa fa-handshake-o" aria-hidden="true"></i>  Become an Affiliate</a></li>
            <li><a href="#"><i class="fa fa-television" aria-hidden="true"></i>  Advertise Your Products</a></li>
            <li><a href="#"><i class="fa fa-amazon" aria-hidden="true"></i>  Amazon Pay on Merchants</a></li>
          </ul>
        </div>
        <div>
          <h5>Amazon Payment Products</h5>
          <ul>
            <li><a href="#"><i class="fa fa-credit-card" aria-hidden="true"></i>  Amazon Business Card</a></li>
            <li><a href="#"><i class="fa fa-gift" aria-hidden="true"></i>  Shop with Points</a></li>
            <li><a href="#"><i class="fa fa-refresh" aria-hidden="true"></i>  Reload Your Balance</a></li>
            <li><a href="#"><i class="fa fa-money" aria-hidden="true"></i>  Amazon Currency Converter</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 1996-2023, Amazon.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
};

export default App;
