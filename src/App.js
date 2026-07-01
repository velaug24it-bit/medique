import React, { useState, useEffect } from 'react';

// Complete Medical System App
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null); // Changed from object to null
  const [appointments, setAppointments] = useState([]);
  
  // Authentication states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: '',
    address: ''
  });
  
  // Medicine ordering states
  const [cart, setCart] = useState([]);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, delivery, payment, confirmation
  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryOption: 'hospital',
    address: '',
    deliveryDate: '',
    deliveryTime: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'card', // 'card', 'cod', 'bank', 'upi'
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    upiId: '',
    bankName: '',
    accountNumber: '',
    transactionId: ''
  });

  // Initialize user from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('medicare_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Update delivery address with user's address
      setDeliveryInfo(prev => ({
        ...prev,
        address: userData.address
      }));
    }
  }, []);

  // Function to save user to localStorage
  const saveUserToStorage = (userData) => {
    localStorage.setItem('medicare_user', JSON.stringify(userData));
  };

  // Function to remove user from localStorage
  const removeUserFromStorage = () => {
    localStorage.removeItem('medicare_user');
  };

  // Navigation Bar Component
  const Navbar = () => (
    <div style={styles.navbar}>
      <div style={styles.logo} onClick={() => setCurrentPage('dashboard')}>
        <h2 style={{margin: 0, color: 'white'}}>🏥 MediCare System</h2>
      </div>
      <div style={styles.navLinks}>
        <button style={styles.navButton} onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
        <button style={styles.navButton} onClick={() => setCurrentPage('book-appointment')}>Book Appointment</button>
        <button style={styles.navButton} onClick={() => setCurrentPage('check-queue')}>Check Queue</button>
        <button style={styles.navButton} onClick={() => setCurrentPage('doctor-availability')}>Doctors</button>
        <button style={styles.navButton} onClick={() => {
          setCurrentPage('order-medicine');
          setCheckoutStep('cart');
        }}>Medicine</button>
        <button style={styles.navButton} onClick={() => setCurrentPage('my-appointments')}>Appointments</button>
        <button style={styles.navButton} onClick={() => setCurrentPage('prescriptions')}>Prescriptions</button>
        <button style={styles.navButton} onClick={() => setCurrentPage('order-history')}>Orders</button>
      </div>
      
      {/* User Authentication Section */}
      <div style={styles.userAuthSection}>
        {user ? (
          // Show user info when logged in
          <div style={styles.userInfo}>
            <span style={{marginRight: '10px'}}>{user.name}</span>
            <div style={styles.userAvatar}>{user.name.charAt(0)}</div>
            <button 
              style={styles.logoutButton}
              onClick={() => {
                setUser(null);
                removeUserFromStorage();
                alert("Logged out successfully!");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          // Show login/signup buttons when not logged in
          <div style={styles.authButtons}>
            <button 
              style={styles.loginButton}
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
            <button 
              style={styles.signupButton}
              onClick={() => setShowSignupModal(true)}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Login Modal Component
  const LoginModal = () => {
    const handleLogin = () => {
      // Simple validation
      if (!loginData.email || !loginData.password) {
        alert("Please enter both email and password");
        return;
      }
      
      // Check if we have saved user data
      const savedUser = localStorage.getItem('medicare_user');
      let userData;
      
      if (savedUser) {
        userData = JSON.parse(savedUser);
        // Check if email matches
        if (userData.email === loginData.email) {
          setUser(userData);
          setShowLoginModal(false);
          setLoginData({ email: '', password: '' });
          setDeliveryInfo(prev => ({
            ...prev,
            address: userData.address
          }));
          alert(`Welcome back, ${userData.name}!`);
          return;
        }
      }
      
      // If no saved user or email doesn't match, create new demo user
      const emailName = loginData.email.split('@')[0];
      const formattedName = emailName
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ') || "User";
      
      const newUser = {
        name: formattedName,
        email: loginData.email,
        phone: "+1 (555) 123-4567",
        address: "123 Main St, City, State 12345"
      };
      
      // Save to localStorage
      saveUserToStorage(newUser);
      setUser(newUser);
      setShowLoginModal(false);
      setLoginData({ email: '', password: '' });
      
      setDeliveryInfo(prev => ({
        ...prev,
        address: newUser.address
      }));
      
      alert(`Login successful! Welcome ${newUser.name}!`);
    };

    return (
      <div style={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={{margin: 0}}>Login to MediCare</h2>
            <button 
              style={styles.closeButton}
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
          </div>
          
          <div style={styles.modalBody}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                style={styles.input}
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Password:</label>
              <input
                type="password"
                style={styles.input}
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Enter your password"
              />
            </div>
            
            {/* Demo credentials hint */}
            <div style={styles.demoHint}>
              <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#666'}}>
                💡 For demo: Use any email. Password can be anything.
              </p>
              <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#666'}}>
                Example: john.doe@example.com → Name: "John Doe"
              </p>
            </div>
            
            <div style={styles.modalFooter}>
              <button 
                style={styles.primaryButton}
                onClick={handleLogin}
              >
                Login
              </button>
              
              <p style={{textAlign: 'center', marginTop: '15px'}}>
                Don't have an account?{' '}
                <span 
                  style={{color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold'}}
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowSignupModal(true);
                  }}
                >
                  Sign up here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Signup Modal Component
  const SignupModal = () => {
    const handleSignup = () => {
      // Validation
      if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
        alert("Please fill in all required fields");
        return;
      }
      
      if (signupData.password !== signupData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      // Create new user
      const newUser = {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone || "+1 (555) 123-4567",
        address: signupData.address || "123 Main St, City, State 12345"
      };
      
      // Save to localStorage
      saveUserToStorage(newUser);
      setUser(newUser);
      setShowSignupModal(false);
      setSignupData({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        phone: '',
        address: ''
      });
      
      // Update delivery address with user's address
      setDeliveryInfo(prev => ({
        ...prev,
        address: newUser.address
      }));
      
      alert(`Account created successfully! Welcome to MediCare, ${newUser.name}!`);
    };

    return (
      <div style={styles.modalOverlay} onClick={() => setShowSignupModal(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={{margin: 0}}>Create Account</h2>
            <button 
              style={styles.closeButton}
              onClick={() => setShowSignupModal(false)}
            >
              ×
            </button>
          </div>
          
          <div style={styles.modalBody}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                style={styles.input}
                value={signupData.name}
                onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                style={styles.input}
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                style={styles.input}
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                placeholder="Create a password"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                style={styles.input}
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                placeholder="Confirm your password"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                style={styles.input}
                value={signupData.phone}
                onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Address</label>
              <textarea
                style={styles.textarea}
                value={signupData.address}
                onChange={(e) => setSignupData({...signupData, address: e.target.value})}
                placeholder="Enter your address"
                rows="3"
              />
            </div>
            
            <div style={styles.modalFooter}>
              <button 
                style={styles.primaryButton}
                onClick={handleSignup}
              >
                Create Account
              </button>
              
              <p style={{textAlign: 'center', marginTop: '15px'}}>
                Already have an account?{' '}
                <span 
                  style={{color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold'}}
                  onClick={() => {
                    setShowSignupModal(false);
                    setShowLoginModal(true);
                  }}
                >
                  Login here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const stats = [
      { title: "Upcoming Appointments", value: appointments.filter(a => new Date(a.date) >= new Date()).length, icon: "📅", color: "#1a73e8" },
      { title: "Queue Position", value: 5, icon: "👥", color: "#4caf50" },
      { title: "Pending Orders", value: orders.filter(o => o.status === 'Processing').length, icon: "📦", color: "#ff9800" },
      { title: "Available Doctors", value: 8, icon: "👨‍⚕️", color: "#9c27b0" }
    ];

    const quickActions = [
      { title: "Book Appointment", icon: "📅", page: "book-appointment", color: "#1a73e8" },
      { title: "Check Queue", icon: "👥", page: "check-queue", color: "#4caf50" },
      { title: "Order Medicine", icon: "💊", page: "order-medicine", color: "#ff9800" },
      { title: "View Doctors", icon: "👨‍⚕️", page: "doctor-availability", color: "#9c27b0" }
    ];

    // Get upcoming appointments for dashboard
    const upcomingAppointments = appointments
      .filter(a => new Date(a.date) >= new Date())
      .slice(0, 3);

    // Recent orders
    const recentOrders = orders.slice(0, 2);

    return (
      <div style={styles.dashboard}>
        <h1 style={styles.pageTitle}>
          {user ? `Welcome back, ${user.name}!` : 'Welcome to MediCare System'}
        </h1>
        
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={{...styles.statCard, borderLeft: `5px solid ${stat.color}`}}>
              <div style={{fontSize: '2.5rem'}}>{stat.icon}</div>
              <h3 style={styles.statTitle}>{stat.title}</h3>
              <div style={{...styles.statValue, color: stat.color}}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <button 
              key={index}
              style={{...styles.actionCard, borderColor: action.color}}
              onClick={() => {
                if ((action.page === 'book-appointment' || action.page === 'order-medicine') && !user) {
                  alert("Please login to access this feature");
                  setShowLoginModal(true);
                } else {
                  setCurrentPage(action.page);
                }
              }}
            >
              <div style={{fontSize: '3rem', marginBottom: '15px'}}>{action.icon}</div>
              <h3 style={{margin: 0, color: '#333'}}>{action.title}</h3>
            </button>
          ))}
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div style={styles.activityCard}>
            <h2 style={styles.sectionTitle}>Upcoming Appointments</h2>
            <ul style={styles.activityList}>
              {upcomingAppointments.map((appointment, index) => (
                <li key={index} style={styles.activityItem}>
                  📅 {appointment.doctor} - {appointment.date} at {appointment.time}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div style={styles.activityCard}>
            <h2 style={styles.sectionTitle}>Recent Orders</h2>
            <ul style={styles.activityList}>
              {recentOrders.map((order, index) => (
                <li key={index} style={styles.activityItem}>
                  📦 Order #{order.id}: {order.items.length} items - {order.status}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Activity */}
        <div style={styles.activityCard}>
          <h2 style={styles.sectionTitle}>Recent Activity</h2>
          <ul style={styles.activityList}>
            {appointments.length > 0 && (
              <li style={styles.activityItem}>✅ Appointment booked with {appointments[appointments.length - 1]?.doctor}</li>
            )}
            {orders.length > 0 && (
              <li style={styles.activityItem}>📦 Order #{orders[orders.length - 1].id} has been placed</li>
            )}
            <li style={styles.activityItem}>👨‍⚕️ Dr. Johnson updated your prescription</li>
            <li style={styles.activityItem}>📅 Follow-up appointment scheduled for next week</li>
          </ul>
        </div>
      </div>
    );
  };

  // Order Medicine Component
  const OrderMedicine = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    // Removed unused quantities state

    const medicines = [
      { id: 1, name: "Paracetamol 500mg", price: 5.99, prescription: false, category: "Pain Relief", stock: 50, description: "For fever and mild pain relief" },
      { id: 2, name: "Amoxicillin 250mg", price: 12.99, prescription: true, category: "Antibiotics", stock: 30, description: "Antibiotic for bacterial infections" },
      { id: 3, name: "Ibuprofen 400mg", price: 8.99, prescription: false, category: "Pain Relief", stock: 45, description: "For inflammation and pain" },
      { id: 4, name: "Cetirizine 10mg", price: 7.49, prescription: false, category: "Allergy", stock: 60, description: "For allergy relief" },
      { id: 5, name: "Omeprazole 20mg", price: 14.99, prescription: true, category: "Digestive", stock: 25, description: "For acid reflux" },
      { id: 6, name: "Metformin 500mg", price: 18.99, prescription: true, category: "Diabetes", stock: 20, description: "For type 2 diabetes" },
      { id: 7, name: "Atorvastatin 20mg", price: 22.99, prescription: true, category: "Cholesterol", stock: 18, description: "Cholesterol lowering medication" },
      { id: 8, name: "Vitamin C 1000mg", price: 9.99, prescription: false, category: "Vitamins", stock: 100, description: "Immune system support" },
      { id: 9, name: "Aspirin 75mg", price: 6.49, prescription: false, category: "Pain Relief", stock: 55, description: "Blood thinner and pain relief" },
      { id: 10, name: "Loratadine 10mg", price: 8.99, prescription: false, category: "Allergy", stock: 40, description: "Non-drowsy allergy relief" }
    ];

    const categories = ['all', ...new Set(medicines.map(m => m.category))];

    const filteredMedicines = medicines.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png') {
          setPrescriptionFile(file);
          setPrescriptionUploaded(true);
          alert(`✅ Prescription uploaded: ${file.name}`);
        } else {
          alert("Please upload a PDF, JPEG, or PNG file");
        }
      }
    };

    const removePrescription = () => {
      setPrescriptionFile(null);
      setPrescriptionUploaded(false);
      alert("Prescription removed");
    };

    const addToCart = (medicine, quantity = 1) => {
      if (medicine.prescription && !prescriptionUploaded) {
        alert("This medicine requires a prescription. Please upload one first.");
        return;
      }
      
      if (medicine.stock < quantity) {
        alert(`Only ${medicine.stock} items available in stock`);
        return;
      }

      const existingItemIndex = cart.findIndex(item => item.id === medicine.id);
      
      if (existingItemIndex >= 0) {
        const newCart = [...cart];
        const newQuantity = newCart[existingItemIndex].quantity + quantity;
        
        if (newQuantity > medicine.stock) {
          alert(`Cannot add more than ${medicine.stock} items in total`);
          return;
        }
        
        newCart[existingItemIndex].quantity = newQuantity;
        newCart[existingItemIndex].total = newQuantity * medicine.price;
        setCart(newCart);
      } else {
        setCart([...cart, { 
          ...medicine, 
          cartId: Date.now(),
          quantity: quantity,
          total: quantity * medicine.price
        }]);
      }
      
      alert(`${quantity} × ${medicine.name} added to cart`);
    };

    const removeFromCart = (cartId) => {
      setCart(cart.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, newQuantity) => {
      if (newQuantity < 1) {
        removeFromCart(cartId);
        return;
      }

      const medicine = cart.find(item => item.cartId === cartId);
      if (medicine && newQuantity > medicine.stock) {
        alert(`Only ${medicine.stock} items available in stock`);
        return;
      }

      setCart(cart.map(item => 
        item.cartId === cartId 
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      ));
    };

    const total = cart.reduce((sum, item) => sum + item.total, 0);
    const deliveryCharge = deliveryInfo.deliveryOption === 'home' ? 5.00 : 0;
    const finalTotal = total + deliveryCharge;

    const handleCheckout = () => {
      if (cart.length === 0) {
        alert("Your cart is empty. Add some medicines first.");
        return;
      }

      // Check if user is logged in
      if (!user) {
        alert("Please login or sign up to proceed with checkout.");
        setShowLoginModal(true);
        return;
      }

      // Check prescription requirement
      const requiresPrescription = cart.some(item => item.prescription);
      if (requiresPrescription && !prescriptionUploaded) {
        alert("Some items in your cart require a prescription. Please upload one first.");
        return;
      }

      setCheckoutStep('delivery');
    };

    // Delivery Information Component
    const DeliveryInfo = () => (
      <div style={styles.deliverySection}>
        <h2 style={styles.sectionTitle}>Delivery Information</h2>
        <div style={styles.formCard}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Option:</label>
            <div style={styles.deliveryOptions}>
              <label style={styles.deliveryOption}>
                <input 
                  type="radio" 
                  name="delivery" 
                  value="hospital"
                  checked={deliveryInfo.deliveryOption === 'hospital'}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryOption: e.target.value})}
                /> Hospital Pickup (Free)
              </label>
              <label style={styles.deliveryOption}>
                <input 
                  type="radio" 
                  name="delivery" 
                  value="home"
                  checked={deliveryInfo.deliveryOption === 'home'}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryOption: e.target.value})}
                /> Home Delivery (+$5.00)
              </label>
            </div>
          </div>

          {deliveryInfo.deliveryOption === 'home' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Delivery Address:</label>
                <textarea 
                  style={styles.textarea}
                  value={deliveryInfo.address || (user ? user.address : '')}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                  rows="3"
                  placeholder={user ? user.address : "Please login to see your address"}
                  disabled={!user}
                />
                {!user && (
                  <p style={{color: '#ff9800', fontSize: '0.9rem', marginTop: '5px'}}>
                    Please login to enter your delivery address
                  </p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Delivery Date:</label>
                <input 
                  type="date"
                  style={styles.input}
                  value={deliveryInfo.deliveryDate}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Delivery Time:</label>
                <select 
                  style={styles.select}
                  value={deliveryInfo.deliveryTime}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryTime: e.target.value})}
                >
                  <option value="">Select Time Slot</option>
                  <option value="09:00-12:00">Morning (9 AM - 12 PM)</option>
                  <option value="12:00-15:00">Afternoon (12 PM - 3 PM)</option>
                  <option value="15:00-18:00">Evening (3 PM - 6 PM)</option>
                </select>
              </div>
            </>
          )}

          <div style={styles.checkoutButtons}>
            <button style={styles.secondaryButton} onClick={() => setCheckoutStep('cart')}>
              ← Back to Cart
            </button>
            <button style={styles.primaryButton} onClick={() => setCheckoutStep('payment')}>
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    );

    // Payment Information Component with multiple options
    const PaymentInfo = () => {
      const renderPaymentForm = () => {
        switch(paymentInfo.paymentMethod) {
          case 'card':
            return (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Card Number:</label>
                  <input 
                    type="text"
                    style={styles.input}
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Card Holder Name:</label>
                  <input 
                    type="text"
                    style={styles.input}
                    value={paymentInfo.cardHolder}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardHolder: e.target.value})}
                    placeholder={user ? user.name : "John Doe"}
                  />
                </div>

                <div style={styles.twoColumnForm}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Expiry Date:</label>
                    <input 
                      type="text"
                      style={styles.input}
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>CVV:</label>
                    <input 
                      type="text"
                      style={styles.input}
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.checkboxLabel}>
                    <input 
                      type="checkbox"
                      checked={paymentInfo.saveCard}
                      onChange={(e) => setPaymentInfo({...paymentInfo, saveCard: e.target.checked})}
                    /> Save card for future payments
                  </label>
                </div>
              </>
            );
          
          case 'upi':
            return (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>UPI ID:</label>
                  <input 
                    type="text"
                    style={styles.input}
                    value={paymentInfo.upiId}
                    onChange={(e) => setPaymentInfo({...paymentInfo, upiId: e.target.value})}
                    placeholder="username@bankname"
                  />
                </div>
                <div style={styles.paymentNote}>
                  <p>💡 You'll be redirected to your UPI app to complete the payment</p>
                </div>
              </>
            );
          
          case 'bank':
            return (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Bank Name:</label>
                  <input 
                    type="text"
                    style={styles.input}
                    value={paymentInfo.bankName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, bankName: e.target.value})}
                    placeholder="e.g., HDFC Bank, ICICI Bank"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Account Number:</label>
                  <input 
                    type="text"
                    style={styles.input}
                    value={paymentInfo.accountNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, accountNumber: e.target.value})}
                    placeholder="Enter your account number"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Transaction ID (if already paid):</label>
                  <input 
                    type="text"
                    style={styles.input}
                    value={paymentInfo.transactionId}
                    onChange={(e) => setPaymentInfo({...paymentInfo, transactionId: e.target.value})}
                    placeholder="Optional: Enter transaction ID"
                  />
                </div>
                <div style={styles.paymentNote}>
                  <p>🏦 Bank Details for Transfer:</p>
                  <p><strong>Account Name:</strong> MediCare Pharmacy</p>
                  <p><strong>Account Number:</strong> 123456789012</p>
                  <p><strong>IFSC Code:</strong> MEDI1234567</p>
                </div>
              </>
            );
          
          case 'cod':
            return (
              <div style={styles.codMessage}>
                <div style={styles.codIcon}>💰</div>
                <h3>Cash on Delivery</h3>
                <p>Pay ${(finalTotal + 20).toFixed(2)} when you receive your order.</p>
                <p style={{color: '#666', fontSize: '0.9rem'}}>
                  Note: A $20 cash handling fee applies to COD orders
                </p>
              </div>
            );
          
          default:
            return null;
        }
      };

      const validatePaymentDetails = () => {
        switch(paymentInfo.paymentMethod) {
          case 'card':
            if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
              alert("Please fill in all card details");
              return false;
            }
            if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
              alert("Please enter a valid 16-digit card number");
              return false;
            }
            if (paymentInfo.cvv.length < 3) {
              alert("Please enter a valid CVV");
              return false;
            }
            return true;
          
          case 'upi':
            if (!paymentInfo.upiId || !paymentInfo.upiId.includes('@')) {
              alert("Please enter a valid UPI ID (format: username@bankname)");
              return false;
            }
            return true;
          
          case 'bank':
            if (!paymentInfo.bankName || !paymentInfo.accountNumber) {
              alert("Please fill in bank name and account number");
              return false;
            }
            return true;
          
          case 'cod':
            return true; // No validation needed for COD
          
          default:
            return false;
        }
      };

      return (
        <div style={styles.paymentSection}>
          <h2 style={styles.sectionTitle}>Payment Information</h2>
          <div style={styles.formCard}>
            
            {/* Payment Method Selection */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Payment Method:</label>
              <div style={styles.paymentMethodOptions}>
                <label style={styles.paymentMethodOption}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card"
                    checked={paymentInfo.paymentMethod === 'card'}
                    onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value})}
                  />
                  <div style={styles.paymentMethodContent}>
                    <span style={styles.paymentIcon}>💳</span>
                    <div>
                      <div style={styles.paymentMethodTitle}>Credit/Debit Card</div>
                      <div style={styles.paymentMethodDesc}>Visa, Mastercard, RuPay</div>
                    </div>
                  </div>
                </label>

                <label style={styles.paymentMethodOption}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="upi"
                    checked={paymentInfo.paymentMethod === 'upi'}
                    onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value})}
                  />
                  <div style={styles.paymentMethodContent}>
                    <span style={styles.paymentIcon}>📱</span>
                    <div>
                      <div style={styles.paymentMethodTitle}>UPI</div>
                      <div style={styles.paymentMethodDesc}>Google Pay, PhonePe, Paytm</div>
                    </div>
                  </div>
                </label>

                <label style={styles.paymentMethodOption}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="bank"
                    checked={paymentInfo.paymentMethod === 'bank'}
                    onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value})}
                  />
                  <div style={styles.paymentMethodContent}>
                    <span style={styles.paymentIcon}>🏦</span>
                    <div>
                      <div style={styles.paymentMethodTitle}>Bank Transfer</div>
                      <div style={styles.paymentMethodDesc}>NEFT, RTGS, IMPS</div>
                    </div>
                  </div>
                </label>

                <label style={styles.paymentMethodOption}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod"
                    checked={paymentInfo.paymentMethod === 'cod'}
                    onChange={(e) => setPaymentInfo({...paymentInfo, paymentMethod: e.target.value})}
                  />
                  <div style={styles.paymentMethodContent}>
                    <span style={styles.paymentIcon}>💰</span>
                    <div>
                      <div style={styles.paymentMethodTitle}>Cash on Delivery</div>
                      <div style={styles.paymentMethodDesc}>Pay when you receive</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Dynamic Payment Form */}
            {renderPaymentForm()}

            {/* Order Summary */}
            <div style={styles.paymentSummary}>
              <h4>Order Summary</h4>
              <div style={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Delivery:</span>
                <span>${deliveryCharge.toFixed(2)}</span>
              </div>
              {paymentInfo.paymentMethod === 'cod' && (
                <div style={styles.summaryRow}>
                  <span>Cash Handling Fee:</span>
                  <span>$20.00</span>
                </div>
              )}
              <div style={{...styles.summaryRow, borderTop: '2px solid #333', paddingTop: '10px'}}>
                <span><strong>Total:</strong></span>
                <span><strong>${paymentInfo.paymentMethod === 'cod' ? (finalTotal + 20).toFixed(2) : finalTotal.toFixed(2)}</strong></span>
              </div>
            </div>

            <div style={styles.checkoutButtons}>
              <button style={styles.secondaryButton} onClick={() => setCheckoutStep('delivery')}>
                ← Back to Delivery
              </button>
              <button style={styles.primaryButton} onClick={() => {
                if (validatePaymentDetails()) {
                  handlePlaceOrder();
                }
              }}>
                {paymentInfo.paymentMethod === 'cod' ? 'Place COD Order' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      );
    };

    const handlePlaceOrder = () => {
      // Final total calculation
      const orderTotal = paymentInfo.paymentMethod === 'cod' ? finalTotal + 20 : finalTotal;

      // Simulate payment processing
      const orderId = 'ORD' + Date.now().toString().slice(-8);
      const newOrder = {
        id: orderId,
        items: [...cart],
        total: orderTotal,
        delivery: deliveryInfo,
        payment: {...paymentInfo, amountPaid: orderTotal},
        status: paymentInfo.paymentMethod === 'cod' ? 'Pending Payment' : 'Processing',
        orderDate: new Date().toLocaleDateString(),
        estimatedDelivery: deliveryInfo.deliveryOption === 'hospital' ? 'Ready in 1 hour' : 
                          deliveryInfo.deliveryDate ? `Delivery on ${deliveryInfo.deliveryDate}` : 'Within 2-3 days',
        paymentMethod: paymentInfo.paymentMethod
      };

      setOrders([...orders, newOrder]);
      setCart([]);
      setCheckoutStep('confirmation');
      
      alert(`✅ Order placed successfully!\nOrder ID: ${orderId}\nTotal: $${orderTotal.toFixed(2)}\nPayment Method: ${paymentInfo.paymentMethod.toUpperCase()}`);
    };

    // Order Confirmation Component
    const OrderConfirmation = () => {
      const latestOrder = orders[orders.length - 1];
      
      return (
        <div style={styles.confirmationSection}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.sectionTitle}>Order Confirmed!</h2>
          <p>Thank you for your order. Your medicines will be prepared shortly.</p>
          
          <div style={styles.orderSummaryCard}>
            <h3>Order Details</h3>
            <div style={styles.orderDetails}>
              <div style={styles.detailRow}>
                <span><strong>Order ID:</strong></span>
                <span>{latestOrder?.id}</span>
              </div>
              <div style={styles.detailRow}>
                <span><strong>Order Date:</strong></span>
                <span>{latestOrder?.orderDate}</span>
              </div>
              <div style={styles.detailRow}>
                <span><strong>Total Amount:</strong></span>
                <span>${latestOrder?.total.toFixed(2)}</span>
              </div>
              <div style={styles.detailRow}>
                <span><strong>Payment Method:</strong></span>
                <span style={{textTransform: 'uppercase'}}>{latestOrder?.paymentMethod}</span>
              </div>
              <div style={styles.detailRow}>
                <span><strong>Status:</strong></span>
                <span style={styles.statusProcessing}>{latestOrder?.status}</span>
              </div>
              <div style={styles.detailRow}>
                <span><strong>Delivery:</strong></span>
                <span>{latestOrder?.estimatedDelivery}</span>
              </div>
            </div>
          </div>

          <div style={styles.confirmationActions}>
            <button style={styles.primaryButton} onClick={() => {
              setCurrentPage('order-history');
              setCheckoutStep('cart');
            }}>
              View Order History
            </button>
            <button style={styles.secondaryButton} onClick={() => {
              setCurrentPage('order-medicine');
              setCheckoutStep('cart');
            }}>
              Continue Shopping
            </button>
          </div>
        </div>
      );
    };

    // Order History Component (now used inside OrderMedicine)
    const OrderHistory = () => (
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>Order History</h1>
        
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your order history</p>
            <button 
              style={styles.primaryButton}
              onClick={() => {
                setCurrentPage('order-medicine');
                setCheckoutStep('cart');
              }}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order, index) => (
              <div key={index} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <h3 style={{margin: 0, color: '#1a73e8'}}>Order #{order.id}</h3>
                    <p style={{color: '#666', margin: '5px 0'}}>Placed on {order.orderDate}</p>
                    <p style={{color: '#666', margin: '5px 0', fontSize: '0.9rem'}}>
                      Payment: {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                  <div style={styles.orderStatus}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: order.status === 'Delivered' ? '#4caf50' : 
                                     order.status === 'Processing' ? '#ff9800' : '#f44336'
                    }}>
                      {order.status}
                    </span>
                    <div style={{fontSize: '1.2rem', fontWeight: 'bold', marginTop: '5px'}}>
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div style={styles.orderItems}>
                  <h4>Items ({order.items.length}):</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={styles.orderItem}>
                      <span>{item.quantity} × {item.name}</span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div style={styles.orderFooter}>
                  <div style={styles.deliveryInfo}>
                    <p><strong>Delivery:</strong> {order.delivery.deliveryOption === 'hospital' ? 'Hospital Pickup' : 'Home Delivery'}</p>
                    <p><strong>Estimated:</strong> {order.estimatedDelivery}</p>
                  </div>
                  <button style={styles.viewButton}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button style={styles.backButton} onClick={() => {
          setCurrentPage('order-medicine');
          setCheckoutStep('cart');
        }}>
          ← Back to Medicine Store
        </button>
      </div>
    );

    // Cart View Component
    const CartView = () => (
      <>
        <div style={styles.medicineContainer}>
          {/* Medicine List */}
          <div style={styles.medicineList}>
            <div style={styles.searchSection}>
              <input
                type="text"
                style={styles.searchInput}
                placeholder="🔍 Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select 
                style={styles.categorySelect}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Prescription Upload Section */}
            {!prescriptionUploaded && (
              <div style={styles.prescriptionSection}>
                <div style={styles.prescriptionWarning}>
                  <div>
                    <h4 style={{margin: '0 0 5px 0'}}>📄 Prescription Required</h4>
                    <p style={{margin: 0, color: '#666'}}>Upload prescription for prescribed medicines</p>
                  </div>
                  <div style={styles.uploadButtons}>
                    <label style={styles.uploadButton}>
                      <input 
                        type="file" 
                        style={{display: 'none'}}
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      Upload Prescription
                    </label>
                  </div>
                </div>
              </div>
            )}

            {prescriptionUploaded && (
              <div style={styles.prescriptionUploaded}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span style={{fontSize: '1.5rem'}}>✅</span>
                  <div>
                    <strong>Prescription Uploaded</strong>
                    <p style={{margin: '2px 0', fontSize: '0.9rem', color: '#666'}}>
                      {prescriptionFile?.name || 'Prescription file'}
                    </p>
                  </div>
                </div>
                <button style={styles.removeButton} onClick={removePrescription}>
                  Remove
                </button>
              </div>
            )}

            {/* Medicines Grid */}
            <div style={styles.medicinesGrid}>
              {filteredMedicines.map(medicine => (
                <div key={medicine.id} style={styles.medicineCard}>
                  <div style={styles.medicineHeader}>
                    <h4 style={{margin: '0 0 5px 0', color: '#333'}}>{medicine.name}</h4>
                    <span style={styles.medicineCategory}>{medicine.category}</span>
                  </div>
                  
                  <p style={{color: '#666', fontSize: '0.9rem', margin: '10px 0'}}>
                    {medicine.description}
                  </p>
                  
                  <div style={styles.medicineFooter}>
                    <div>
                      <div style={styles.medicinePrice}>${medicine.price.toFixed(2)}</div>
                      <div style={styles.stockInfo}>
                        <span style={{
                          color: medicine.stock > 10 ? '#4caf50' : '#f44336',
                          fontSize: '0.8rem'
                        }}>
                          {medicine.stock > 10 ? 'In Stock' : 'Low Stock'} ({medicine.stock})
                        </span>
                      </div>
                    </div>
                    
                    {medicine.prescription && (
                      <span style={styles.prescriptionBadge}>Prescription Required</span>
                    )}
                    
                    <button 
                      style={styles.addToCartButton}
                      onClick={() => addToCart(medicine, 1)}
                      disabled={medicine.stock === 0}
                    >
                      {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div style={styles.cartSection}>
            <div style={styles.cartHeader}>
              <h3 style={{margin: 0}}>🛒 Your Cart ({cart.length} items)</h3>
              <span style={styles.cartTotalMini}>${total.toFixed(2)}</span>
            </div>
            
            {cart.length === 0 ? (
              <div style={styles.emptyCart}>
                <div style={{fontSize: '3rem', marginBottom: '15px'}}>🛒</div>
                <p>Your cart is empty</p>
                <p style={{color: '#666'}}>Add medicines to get started</p>
              </div>
            ) : (
              <>
                <div style={styles.cartItems}>
                  {cart.map((item) => (
                    <div key={item.cartId} style={styles.cartItem}>
                      <div style={styles.cartItemInfo}>
                        <div style={{fontWeight: 'bold', fontSize: '0.95rem'}}>{item.name}</div>
                        <div style={{color: '#666', fontSize: '0.85rem'}}>${item.price.toFixed(2)} each</div>
                      </div>
                      
                      <div style={styles.cartItemControls}>
                        <div style={styles.quantityControls}>
                          <button 
                            style={styles.quantityButton}
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span style={styles.quantityDisplay}>{item.quantity}</span>
                          <button 
                            style={styles.quantityButton}
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        
                        <div style={styles.cartItemPrice}>
                          ${item.total.toFixed(2)}
                        </div>
                        
                        <button 
                          style={styles.removeCartButton}
                          onClick={() => removeFromCart(item.cartId)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={styles.cartSummary}>
                  <div style={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Delivery:</span>
                    <span>${deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div style={styles.summaryRowTotal}>
                    <span><strong>Total:</strong></span>
                    <span><strong>${finalTotal.toFixed(2)}</strong></span>
                  </div>
                </div>
                
                <button style={styles.checkoutButton} onClick={handleCheckout}>
                  Proceed to Checkout →
                </button>
                
                <div style={styles.securePayment}>
                  <span style={{fontSize: '0.9rem', color: '#666'}}>🔒 Multiple Payment Options</span>
                  <div style={styles.paymentIcons}>
                    <span style={{fontSize: '1.5rem'}}>💳</span>
                    <span style={{fontSize: '1.5rem'}}>📱</span>
                    <span style={{fontSize: '1.5rem'}}>🏦</span>
                    <span style={{fontSize: '1.5rem'}}>💰</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );

    // Main render based on checkout step
    // If we're on the order-history page, show OrderHistory component
    if (currentPage === 'order-history') {
      return <OrderHistory />;
    }

    return (
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>Order Medicine</h1>
        
        {/* Checkout Steps */}
        <div style={styles.checkoutSteps}>
          <div style={{
            ...styles.checkoutStep,
            ...(checkoutStep === 'cart' && styles.activeStep)
          }}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepText}>Cart</div>
          </div>
          <div style={styles.stepConnector}>→</div>
          <div style={{
            ...styles.checkoutStep,
            ...(checkoutStep === 'delivery' && styles.activeStep)
          }}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepText}>Delivery</div>
          </div>
          <div style={styles.stepConnector}>→</div>
          <div style={{
            ...styles.checkoutStep,
            ...(checkoutStep === 'payment' && styles.activeStep)
          }}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepText}>Payment</div>
          </div>
          <div style={styles.stepConnector}>→</div>
          <div style={{
            ...styles.checkoutStep,
            ...(checkoutStep === 'confirmation' && styles.activeStep)
          }}>
            <div style={styles.stepNumber}>4</div>
            <div style={styles.stepText}>Confirmation</div>
          </div>
        </div>

        {/* Render appropriate component based on checkout step */}
        {checkoutStep === 'cart' && <CartView />}
        {checkoutStep === 'delivery' && <DeliveryInfo />}
        {checkoutStep === 'payment' && <PaymentInfo />}
        {checkoutStep === 'confirmation' && <OrderConfirmation />}

        {checkoutStep === 'cart' && (
          <button style={styles.backButton} onClick={() => setCurrentPage('dashboard')}>
            ← Back to Dashboard
          </button>
        )}
      </div>
    );
  };

  // Book Appointment Component (keep existing)
  const BookAppointment = () => {
    const [formData, setFormData] = useState({
      doctor: '',
      date: '',
      time: '',
      symptoms: '',
      priority: 'normal'
    });

    const doctors = [
      { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", available: true },
      { id: 2, name: "Dr. Michael Chen", specialty: "Dermatology", available: true },
      { id: 3, name: "Dr. Emily Williams", specialty: "Pediatrics", available: false }
    ];

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!formData.doctor || !formData.date || !formData.time) {
        alert("Please fill in all required fields");
        return;
      }
      
      // Check if user is logged in
      if (!user) {
        alert("Please login or sign up to book an appointment.");
        setShowLoginModal(true);
        return;
      }
      
      // Create new appointment object
      const newAppointment = {
        id: Date.now(), // Unique ID
        doctor: formData.doctor,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms,
        status: 'Confirmed',
        priority: formData.priority,
        bookedDate: new Date().toLocaleDateString()
      };
      
      // Add to appointments state
      setAppointments(prev => [...prev, newAppointment]);
      
      alert(`✅ Appointment booked!\nDoctor: ${formData.doctor}\nDate: ${formData.date}\nTime: ${formData.time}\n\nYou can view it in "My Appointments"`);
      
      // Reset form
      setFormData({ doctor: '', date: '', time: '', symptoms: '', priority: 'normal' });
      
      // Redirect to appointments page
      setCurrentPage('my-appointments');
    };

    return (
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>Book Appointment</h1>
        
        <div style={styles.twoColumnLayout}>
          {/* Form */}
          <div style={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Doctor:</label>
                <select 
                  style={styles.select}
                  value={formData.doctor}
                  onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                  required
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.name} disabled={!doctor.available}>
                      {doctor.name} ({doctor.specialty}) {!doctor.available ? '(Unavailable)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Select Date:</label>
                <input 
                  type="date"
                  style={styles.input}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Select Time:</label>
                <select 
                  style={styles.select}
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                >
                  <option value="">-- Select Time --</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Priority:</label>
                <select 
                  style={styles.select}
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Symptoms:</label>
                <textarea 
                  style={styles.textarea}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  placeholder="Describe your symptoms..."
                  rows="4"
                />
              </div>

              <button type="submit" style={styles.primaryButton}>
                📅 Book Appointment
              </button>
            </form>
          </div>

          {/* Available Doctors */}
          <div style={styles.infoCard}>
            <h3 style={{marginBottom: '20px', color: '#333'}}>Available Doctors Today</h3>
            {doctors.filter(d => d.available).map(doctor => (
              <div key={doctor.id} style={styles.doctorCard}>
                <div>
                  <h4 style={{margin: 0, color: '#1a73e8'}}>{doctor.name}</h4>
                  <p style={{margin: '5px 0', color: '#666'}}>{doctor.specialty}</p>
                </div>
                <span style={styles.availableBadge}>Available</span>
              </div>
            ))}
          </div>
        </div>

        <button style={styles.backButton} onClick={() => setCurrentPage('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    );
  };

  // My Appointments Component (keep existing)
  const MyAppointments = () => {
    const [filter, setFilter] = useState('all');
    
    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filter === 'upcoming') {
        return appointmentDate >= today;
      } else if (filter === 'past') {
        return appointmentDate < today;
      }
      return true;
    });

    const cancelAppointment = (id) => {
      if (window.confirm("Are you sure you want to cancel this appointment?")) {
        setAppointments(appointments.filter(app => app.id !== id));
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    return (
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>My Appointments</h1>
        
        {/* Appointment Statistics */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, borderLeft: '5px solid #1a73e8'}}>
            <div style={{fontSize: '2.5rem'}}>📅</div>
            <h3 style={styles.statTitle}>Total Appointments</h3>
            <div style={{...styles.statValue, color: '#1a73e8'}}>{appointments.length}</div>
          </div>
          <div style={{...styles.statCard, borderLeft: '5px solid #4caf50'}}>
            <div style={{fontSize: '2.5rem'}}>✅</div>
            <h3 style={styles.statTitle}>Upcoming</h3>
            <div style={{...styles.statValue, color: '#4caf50'}}>
              {appointments.filter(a => new Date(a.date) >= new Date()).length}
            </div>
          </div>
          <div style={{...styles.statCard, borderLeft: '5px solid #ff9800'}}>
            <div style={{fontSize: '2.5rem'}}>⏰</div>
            <h3 style={styles.statTitle}>Today</h3>
            <div style={{...styles.statValue, color: '#ff9800'}}>
              {appointments.filter(a => {
                const today = new Date().toDateString();
                const appDate = new Date(a.date).toDateString();
                return today === appDate;
              }).length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterButtons}>
          <button 
            style={{...styles.filterButton, ...(filter === 'all' && styles.activeFilter)}}
            onClick={() => setFilter('all')}
          >
            All Appointments
          </button>
          <button 
            style={{...styles.filterButton, ...(filter === 'upcoming' && styles.activeFilter)}}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            style={{...styles.filterButton, ...(filter === 'past' && styles.activeFilter)}}
            onClick={() => setFilter('past')}
          >
            Past Appointments
          </button>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>📅</div>
            <h3>No appointments found</h3>
            <p>{filter === 'all' ? 'Book your first appointment to get started' : 
                filter === 'upcoming' ? 'No upcoming appointments scheduled' : 
                'No past appointments'}</p>
            <button 
              style={styles.primaryButton}
              onClick={() => setCurrentPage('book-appointment')}
            >
              Book Appointment
            </button>
          </div>
        ) : (
          <div style={styles.appointmentsList}>
            {filteredAppointments.map((appointment) => {
              const appointmentDate = new Date(appointment.date);
              const isPast = appointmentDate < new Date();
              
              return (
                <div key={appointment.id} style={{
                  ...styles.appointmentCard,
                  borderLeft: `5px solid ${isPast ? '#666' : '#1a73e8'}`
                }}>
                  <div style={styles.appointmentHeader}>
                    <div>
                      <h3 style={{margin: '0 0 5px 0', color: '#1a73e8'}}>
                        {appointment.doctor}
                      </h3>
                      <div style={{display: 'flex', gap: '15px', color: '#666'}}>
                        <span>📅 {formatDate(appointment.date)}</span>
                        <span>⏰ {appointment.time}</span>
                      </div>
                    </div>
                    <div>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: isPast ? '#666' : '#4caf50'
                      }}>
                        {isPast ? 'Completed' : appointment.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={styles.appointmentBody}>
                    <div>
                      <p><strong>Symptoms:</strong> {appointment.symptoms || 'Not specified'}</p>
                      <p><strong>Priority:</strong> 
                        <span style={{
                          color: appointment.priority === 'urgent' ? '#ff9800' : 
                                 appointment.priority === 'emergency' ? '#f44336' : '#666'
                        }}>
                          {' '}{appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)}
                        </span>
                      </p>
                      <p><strong>Booked on:</strong> {appointment.bookedDate}</p>
                    </div>
                    
                    {!isPast && (
                      <div style={styles.appointmentActions}>
                        <button style={styles.cancelButton} onClick={() => cancelAppointment(appointment.id)}>
                          Cancel Appointment
                        </button>
                        <button style={styles.rescheduleButton}>
                          Reschedule
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button style={styles.backButton} onClick={() => setCurrentPage('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    );
  };

  // Check Queue Component (keep existing)
  const CheckQueue = () => {
    const queueData = {
      currentPosition: 5,
      estimatedWait: "25 minutes",
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      queue: [
        { id: 1, patient: "Alice Brown", status: "In Consultation" },
        { id: 2, patient: "Bob Wilson", status: "Waiting" },
        { id: 3, patient: "Carol Davis", status: "Waiting" },
        { id: 4, patient: "David Miller", status: "Waiting" },
        { id: 5, patient: "You", status: "Next" },
        { id: 6, patient: "Eva Garcia", status: "Waiting" }
      ]
    };

    return (
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>Queue Status</h1>
        
        {/* Queue Summary */}
        <div style={styles.queueSummary}>
          <div style={styles.queueCard}>
            <h3>Your Position</h3>
            <div style={styles.queueNumber}>{queueData.currentPosition}</div>
            <p>in queue</p>
          </div>
          <div style={styles.queueCard}>
            <h3>Estimated Wait</h3>
            <div style={styles.waitTime}>{queueData.estimatedWait}</div>
          </div>
          <div style={styles.queueCard}>
            <h3>Doctor</h3>
            <p style={{fontSize: '1.2rem', margin: '5px 0'}}>{queueData.doctor}</p>
            <p style={{color: '#666'}}>{queueData.department}</p>
          </div>
        </div>

        {/* Current Queue List */}
        <div style={styles.queueListCard}>
          <h3 style={{marginBottom: '20px'}}>Current Queue</h3>
          <div style={styles.queueList}>
            {queueData.queue.map((item, index) => (
              <div 
                key={item.id}
                style={{
                  ...styles.queueItem,
                  backgroundColor: item.patient === "You" ? '#e3f2fd' : 'white',
                  borderLeft: item.patient === "You" ? '5px solid #1a73e8' : '1px solid #eee'
                }}
              >
                <div style={styles.queuePosition}>#{index + 1}</div>
                <div style={{flex: 1}}>{item.patient}</div>
                <div style={{
                  ...styles.queueStatus,
                  backgroundColor: item.status === "In Consultation" ? '#4caf50' : '#ff9800',
                  color: 'white'
                }}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div style={styles.notificationCard}>
          <p>🔔 You'll be notified when it's your turn</p>
          <p>📍 Please stay in the waiting area</p>
        </div>

        <button style={styles.backButton} onClick={() => setCurrentPage('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    );
  };

  // Doctor Availability Component (keep existing)
  const DoctorAvailability = () => {
    const [filter, setFilter] = useState('all');
    
    const doctors = [
      { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", available: true, nextAvailable: "Today, 3 PM" },
      { id: 2, name: "Dr. Michael Chen", specialty: "Dermatology", available: true, nextAvailable: "Today, 4 PM" },
      { id: 3, name: "Dr. Emily Williams", specialty: "Pediatrics", available: false, nextAvailable: "Tomorrow, 10 AM" },
      { id: 4, name: "Dr. Robert Brown", specialty: "Orthopedics", available: true, nextAvailable: "Today, 2 PM" }
    ];

    const filteredDoctors = filter === 'all' ? doctors : 
                           filter === 'available' ? doctors.filter(d => d.available) :
                           doctors.filter(d => !d.available);

    return (
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>Doctor Availability</h1>
        
        {/* Filters */}
        <div style={styles.filterButtons}>
          <button 
            style={{...styles.filterButton, ...(filter === 'all' && styles.activeFilter)}}
            onClick={() => setFilter('all')}
          >
            All Doctors
          </button>
          <button 
            style={{...styles.filterButton, ...(filter === 'available' && styles.activeFilter)}}
            onClick={() => setFilter('available')}
          >
            Available Now
          </button>
          <button 
            style={{...styles.filterButton, ...(filter === 'unavailable' && styles.activeFilter)}}
            onClick={() => setFilter('unavailable')}
          >
            Unavailable
          </button>
        </div>

        {/* Doctors Grid */}
        <div style={styles.doctorsGrid}>
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} style={styles.doctorCardLarge}>
              <div style={styles.doctorHeader}>
                <h3 style={{margin: 0, flex: 1}}>{doctor.name}</h3>
                <span style={{
                  ...styles.availabilityBadge,
                  backgroundColor: doctor.available ? '#4caf50' : '#f44336'
                }}>
                  {doctor.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p style={{color: '#666', margin: '10px 0'}}>{doctor.specialty}</p>
              <p style={{margin: '5px 0'}}><strong>Next Available:</strong> {doctor.nextAvailable}</p>
              <div style={styles.doctorActions}>
                <button 
                  style={styles.bookButton}
                  disabled={!doctor.available}
                  onClick={() => {
                    if (!user) {
                      alert("Please login to book an appointment.");
                      setShowLoginModal(true);
                      return;
                    }
                    setCurrentPage('book-appointment');
                  }}
                >
                  Book Appointment
                </button>
                <button style={styles.viewButton}>View Schedule</button>
              </div>
            </div>
          ))}
        </div>

        <button style={styles.backButton} onClick={() => setCurrentPage('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    );
  };

  // Prescriptions Component
  const Prescriptions = () => {
    const prescriptions = [
      { id: 1, doctor: "Dr. Sarah Johnson", date: "2024-01-15", medicines: ["Amoxicillin 250mg", "Paracetamol 500mg"], status: "Active" },
      { id: 2, doctor: "Dr. Michael Chen", date: "2024-01-10", medicines: ["Cetirizine 10mg"], status: "Active" },
      { id: 3, doctor: "Dr. Emily Williams", date: "2024-01-05", medicines: ["Ibuprofen 400mg"], status: "Expired" }
    ];

    return (
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>My Prescriptions</h1>
        
        <div style={styles.prescriptionsList}>
          {prescriptions.map(prescription => (
            <div key={prescription.id} style={styles.prescriptionCard}>
              <div style={styles.prescriptionHeader}>
                <div>
                  <h3 style={{margin: '0 0 5px 0', color: '#1a73e8'}}>{prescription.doctor}</h3>
                  <p style={{color: '#666', margin: 0}}>Date: {prescription.date}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: prescription.status === 'Active' ? '#4caf50' : '#666'
                }}>
                  {prescription.status}
                </span>
              </div>
              
              <div style={styles.prescriptionBody}>
                <h4>Prescribed Medicines:</h4>
                <ul style={styles.medicinesList}>
                  {prescription.medicines.map((medicine, index) => (
                    <li key={index} style={styles.medicineItem}>
                      💊 {medicine}
                      <button 
                        style={styles.orderFromPrescription}
                        onClick={() => {
                          setCurrentPage('order-medicine');
                          setCheckoutStep('cart');
                        }}
                      >
                        Order Now
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={styles.prescriptionActions}>
                <button style={styles.viewButton}>View Details</button>
                <button style={styles.downloadButton}>Download PDF</button>
              </div>
            </div>
          ))}
        </div>

        <button style={styles.backButton} onClick={() => setCurrentPage('dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    );
  };

  // Footer Component
  const Footer = () => (
    <div style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerSection}>
          <h4 style={{color: 'white', marginBottom: '15px'}}>🏥 MediCare System</h4>
          <p style={{color: '#ccc', margin: '5px 0'}}>Your trusted healthcare partner</p>
          <p style={{color: '#ccc', margin: '5px 0'}}>📍 123 Health Street</p>
        </div>
        <div style={styles.footerSection}>
          <h4 style={{color: 'white', marginBottom: '15px'}}>Contact Us</h4>
          <p style={{color: '#ccc', margin: '5px 0'}}>📞 (123) 456-7890</p>
          <p style={{color: '#ccc', margin: '5px 0'}}>📧 support@medicare.com</p>
        </div>
        <div style={styles.footerSection}>
          <h4 style={{color: 'white', marginBottom: '15px'}}>Emergency</h4>
          <p style={{color: '#ff5252', fontWeight: 'bold', margin: '5px 0'}}>🚑 Call 911 for emergencies</p>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <p style={{color: '#ccc', margin: 0}}>© 2024 MediCare System. All rights reserved.</p>
      </div>
    </div>
  );

  // Main App Render
  return (
    <div style={styles.app}>
      <Navbar />
      <div style={styles.mainContent}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'book-appointment' && <BookAppointment />}
        {currentPage === 'check-queue' && <CheckQueue />}
        {currentPage === 'doctor-availability' && <DoctorAvailability />}
        {currentPage === 'order-medicine' && <OrderMedicine />}
        {currentPage === 'my-appointments' && <MyAppointments />}
        {currentPage === 'prescriptions' && <Prescriptions />}
        {currentPage === 'order-history' && <OrderMedicine />}
      </div>
      
      {/* Show modals if needed */}
      {showLoginModal && <LoginModal />}
      {showSignupModal && <SignupModal />}
      
      <Footer />
    </div>
  );
}

// Styles
const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f9ff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  navbar: {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  logo: {
    cursor: 'pointer'
  },
  navLinks: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  // User Authentication Styles
  userAuthSection: {
    display: 'flex',
    alignItems: 'center'
  },
  authButtons: {
    display: 'flex',
    gap: '10px'
  },
  loginButton: {
    backgroundColor: 'transparent',
    border: '2px solid white',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  signupButton: {
    backgroundColor: 'white',
    border: '2px solid white',
    color: '#1a73e8',
    padding: '8px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    backgroundColor: '#4caf50',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '6px 15px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '10px'
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #eee'
  },
  modalBody: {
    marginBottom: '20px'
  },
  modalFooter: {
    marginTop: '20px'
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#666',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s'
  },
  demoHint: {
    backgroundColor: '#f0f7ff',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #d0e3ff'
  },
  mainContent: {
    minHeight: 'calc(100vh - 180px)',
    padding: '20px'
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  pageTitle: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.3s'
  },
  statTitle: {
    color: '#555',
    margin: '15px 0 10px 0',
    fontSize: '18px'
  },
  statValue: {
    fontSize: '3rem',
    fontWeight: 'bold'
  },
  sectionTitle: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '1.8rem'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  actionCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    border: '2px solid',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px'
  },
  activityCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  activityList: {
    listStyle: 'none',
    padding: 0
  },
  activityItem: {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    fontSize: '16px',
    color: '#555'
  },
  pageContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  twoColumnLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '30px',
    marginBottom: '30px'
  },
  formCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  primaryButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  secondaryButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  doctorCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    marginBottom: '15px'
  },
  availableBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  backButton: {
    display: 'block',
    margin: '30px auto',
    padding: '12px 30px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  // Medicine Ordering Styles
  checkoutSteps: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '40px',
    gap: '10px'
  },
  checkoutStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px 25px',
    borderRadius: '10px',
    backgroundColor: '#f5f5f5',
    color: '#666',
    minWidth: '120px'
  },
  activeStep: {
    backgroundColor: '#1a73e8',
    color: 'white'
  },
  stepNumber: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  stepText: {
    fontSize: '14px',
    fontWeight: '600'
  },
  stepConnector: {
    color: '#ccc',
    fontSize: '20px'
  },
  medicineContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '30px',
    marginBottom: '30px'
  },
  medicineList: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  searchSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  categorySelect: {
    padding: '12px 15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white',
    minWidth: '150px'
  },
  prescriptionSection: {
    marginBottom: '25px'
  },
  prescriptionWarning: {
    backgroundColor: '#e3f2fd',
    border: '2px solid #1a73e8',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  uploadButtons: {
    display: 'flex',
    gap: '10px'
  },
  uploadButton: {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  prescriptionUploaded: {
    backgroundColor: '#e8f5e9',
    border: '2px solid #4caf50',
    padding: '15px 20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px'
  },
  removeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  medicinesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  medicineCard: {
    border: '1px solid #e0e0e0',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  medicineHeader: {
    marginBottom: '15px'
  },
  medicineCategory: {
    display: 'inline-block',
    backgroundColor: '#e3f2fd',
    color: '#1a73e8',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  medicinePrice: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: '5px'
  },
  stockInfo: {
    fontSize: '0.9rem'
  },
  medicineFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  prescriptionBadge: {
    display: 'inline-block',
    backgroundColor: '#ff9800',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center'
  },
  addToCartButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  cartSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    height: 'fit-content',
    position: 'sticky',
    top: '20px'
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0'
  },
  cartTotalMini: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a73e8'
  },
  emptyCart: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666'
  },
  cartItems: {
    marginBottom: '25px',
    maxHeight: '400px',
    overflowY: 'auto'
  },
  cartItem: {
    padding: '15px 0',
    borderBottom: '1px solid #eee'
  },
  cartItemInfo: {
    marginBottom: '10px'
  },
  cartItemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantityDisplay: {
    minWidth: '30px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  cartItemPrice: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  removeCartButton: {
    backgroundColor: '#ff5252',
    color: 'white',
    border: 'none',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cartSummary: {
    padding: '20px 0',
    borderTop: '2px solid #f0f0f0',
    borderBottom: '2px solid #f0f0f0',
    marginBottom: '25px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  summaryRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '2px solid #333',
    fontSize: '1.2rem'
  },
  checkoutButton: {
    width: '100%',
    padding: '18px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s'
  },
  securePayment: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  paymentIcons: {
    display: 'flex',
    gap: '10px'
  },
  // Delivery Section
  deliverySection: {
    marginBottom: '30px'
  },
  deliveryOptions: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px'
  },
  deliveryOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1
  },
  // Payment Section - UPDATED
  paymentSection: {
    marginBottom: '30px'
  },
  paymentMethodOptions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginTop: '10px'
  },
  paymentMethodOption: {
    border: '2px solid #ddd',
    borderRadius: '10px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  paymentMethodContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    width: '100%'
  },
  paymentIcon: {
    fontSize: '2rem'
  },
  paymentMethodTitle: {
    fontWeight: 'bold',
    fontSize: '1rem',
    marginBottom: '5px'
  },
  paymentMethodDesc: {
    fontSize: '0.8rem',
    color: '#666'
  },
  twoColumnForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  paymentSummary: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px'
  },
  paymentNote: {
    backgroundColor: '#e8f5e9',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '20px',
    fontSize: '0.9rem'
  },
  codMessage: {
    backgroundColor: '#fff3e0',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    marginTop: '20px'
  },
  codIcon: {
    fontSize: '3rem',
    marginBottom: '15px'
  },
  // Confirmation Section
  confirmationSection: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    marginBottom: '30px'
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  orderSummaryCard: {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '10px',
    margin: '30px 0',
    textAlign: 'left'
  },
  orderDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee'
  },
  statusProcessing: {
    color: '#ff9800',
    fontWeight: 'bold'
  },
  confirmationActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center'
  },
  // Order History
  ordersList: {
    marginBottom: '30px'
  },
  orderCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    marginBottom: '20px'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  },
  orderStatus: {
    textAlign: 'right'
  },
  statusBadge: {
    padding: '6px 15px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600'
  },
  orderItems: {
    marginBottom: '20px'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #eee'
  },
  deliveryInfo: {
    color: '#666'
  },
  viewButton: {
    padding: '10px 20px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  // Prescriptions
  prescriptionsList: {
    marginBottom: '30px'
  },
  prescriptionCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    marginBottom: '20px'
  },
  prescriptionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  },
  prescriptionBody: {
    marginBottom: '20px'
  },
  medicinesList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '10px'
  },
  medicineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  orderFromPrescription: {
    padding: '8px 15px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  prescriptionActions: {
    display: 'flex',
    gap: '10px'
  },
  downloadButton: {
    padding: '10px 20px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  // Other existing styles
  queueSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  queueCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  queueNumber: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#1a73e8',
    margin: '10px 0'
  },
  waitTime: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#4caf50',
    margin: '10px 0'
  },
  queueListCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    marginBottom: '30px'
  },
  queueList: {
    marginTop: '20px'
  },
  queueItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px'
  },
  queuePosition: {
    width: '50px',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  queueStatus: {
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  notificationCard: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    borderLeft: '5px solid #1a73e8'
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  filterButton: {
    padding: '10px 25px',
    border: '2px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  activeFilter: {
    backgroundColor: '#1a73e8',
    color: 'white',
    borderColor: '#1a73e8'
  },
  doctorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  doctorCardLarge: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  doctorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  availabilityBadge: {
    padding: '6px 15px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600'
  },
  doctorActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  bookButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  // Appointment Styles
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '15px',
    marginBottom: '30px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  appointmentsList: {
    marginBottom: '30px'
  },
  appointmentCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  appointmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  },
  appointmentBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  appointmentActions: {
    display: 'flex',
    gap: '10px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  rescheduleButton: {
    padding: '10px 20px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '40px 30px 20px'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '30px'
  },
  footerSection: {
    marginBottom: '20px'
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #444'
  },
  checkoutButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  }
};

export default App;