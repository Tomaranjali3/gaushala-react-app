import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const PRODUCTS = [
  {
    id: 1,
    name: "Gir Cow ",
    item: "Milk",

    price: "85",
    unit: "Litre",
    img: "https://organicshandy.com/wp-content/uploads/2019/02/Cow-Milk-470x331.webp",
  },
  {
    id: 2,
    name: "Gir cow ",
    item: "Ghee",
    price: "1200",
    unit: "Kg",
    img: "https://cpimg.tistatic.com/09758707/b/5/Pure-Cow-Ghee.jpg",
  },
  {
    id: 3,
    name: "Sahiwal Cow ",
    item: "Ghee",
    price: "450",
    unit: "Kg",
    img: "https://img3.exportersindia.com/product_images/bc-full/dir_148/4420588/sahiwal-cow-03-1516346780_p_2835028_685616.jpeg",
  },
  {
    id: 4,
    name: "Red Sindhi Cow ",
    item: "Milk",
    price: "60",
    unit: "500g",
    img: "https://kj1bcdn.b-cdn.net/media/68039/red-sindhi-cattle.jpg",
  },
  {
    id: 5,
    name: "Organic Cow ",
    item: "Milk",
    price: "90",
    unit: "Litre",
    img: "https://www.roar-fitness.com/wp-content/uploads/2016/02/Article-2-1160x512.jpg",
  },
  {
    id: 6,
    name: "desi Cow ",
    item: "Ghee",
    price: "1300",
    unit: "Kg",
    img: "https://vspca.org/wp-content/uploads/2021/01/cow_shelter.jpg",
  },
  {
    id: 7,
    name: "kankrej Cow ",
    item: "Ghee",
    price: "1200",
    unit: "Kg",
    img: "https://cpimg.tistatic.com/06280799/b/4/Kankrej-Cow-w300.jpg",
  },
  {
    id: 8,
    name: "Tharparkar Cow ",
    item: "Milk",
    price: "80",
    unit: "Litre",
    img: "https://breeds.okstate.edu/cattle/site-files/images/tharparkar.jpg",
  },
  {
    id: 9,
    name: "Hariana Cow ",
    item: "Ghee",
    price: "1250",
    unit: "Kg",
    img: "https://www.petmapz.com/wp-content/uploads/2015/05/Hariana-Cattle.jpg",
  },
  {
    id: 10,
    name: "Punganur Cow ",
    item: "Milk",
    price: "95",
    unit: "Litre",
    img: "https://kj1bcdn.b-cdn.net/media/101000/cow.jpg",
  },
  {
    id: 11,
    name: "Malnad Gidda Cow ",
    item: "Ghee",
    price: "1400",
    unit: "Kg",
    img: "https://myfarmstories.com/cdn/shop/articles/IMG_20200911_161824.jpg?v=1702382225&width=1100",
  },
  {
    id: 12,
    name: "Vechur Cow",
    item: "Milk",
    price: "100",
    unit: "Litre",
    img: "https://images.pexels.com/photos/15543077/pexels-photo-15543077.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200",
  },
  {
    id: 13,
    name: "Kangayam Cow ",
    item: "Ghee",
    price: "1350",
    unit: "Kg",
    img: "https://pasuthai.com/wp-content/uploads/2022/06/Kangayam-cattle-1024x585-1.jpg",
  },
];

function App() {
  const [user, setUser] = useState(null);
  // Mobile state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("default"); // options: 'default', 'price-low', 'price-high'

  // Window resize handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const processedProducts = PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.item.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortType === "low") return Number(a.price) - Number(b.price);
    if (sortType === "high") return Number(b.price) - Number(a.price);
    return 0; // Default
  });

  // cart
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add to Cart Logic
  const addToCart = (product) => {
    setCart((prevCart) => {
      const isItemInCart = prevCart.find((item) => item.id === product.id);
      if (isItemInCart) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  // Quantity control (+ / -)
  const changeQty = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(0, item.qty + amount) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Total Calculation
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const makePayment = async () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: totalAmount * 100,
      currency: "INR",
      name: "GauShala Dairy",
      description: "Premium Dairy Products",
      image: "https://example.com/logo.png", //
      handler: function (response) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
        setCart([]);
        setIsCartOpen(false);
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#181717",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  // --- Inline Styles
  const containerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    height: "100vh",
    width: "100vw",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
  };

  const loginSectionStyle = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 10%",
    backgroundColor: "#ffffff",
  };

  const imageSectionStyle = {
    flex: "1.5",
    display: isMobile ? "none" : "block",
    position: "relative",
  };

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      {!user ? (
        /* --- LOGIN PAGE */
        <div style={containerStyle}>
          {/* LEFT SIDE: LOGIN */}
          <div style={loginSectionStyle}>
            <h1
              style={{
                color: "#181717fe",
                fontSize: "40px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              GAUSHALA
            </h1>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                letterSpacing: "2px",
                marginBottom: "40px",
              }}
            >
              PREMIUM DAIRY PRODUCTS
            </p>

            <h2
              style={{
                fontSize: "36px",
                marginBottom: "10px",
                color: "#1f2937",
              }}
            >
              Welcome Back
            </h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "30px",
                lineHeight: "1.5",
              }}
            >
              Please login to access fresh milk and ghee directly from our farm.
            </p>

            <div
              style={{
                padding: "20px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                width: "fit-content",
              }}
            >
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            </div>

            <p
              style={{ marginTop: "30px", fontSize: "12px", color: "#9ca3af" }}
            >
              By signing in, you agree to our Terms of Service.
            </p>
          </div>

          {/* RIGHT SIDE: IMAGE */}
          <div style={imageSectionStyle}>
            <img
              src="https://img.freepik.com/premium-photo/funny-cow_1295521-3067.jpg"
              alt="Cow"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                left: "40px",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.3)",
                padding: "20px",
                borderRadius: "10px",
                backdropFilter: "blur(5px)",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                "Shuddhata ka doosra naam - GauShala"
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* --- DASHBOARD (Login ke baad) --- */
        <div style={{ padding: isMobile ? "20px" : "40px" }}>
          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              padding: "15px 25px",
              borderRadius: "15px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h1
              style={{
                color: "#151515",
                fontWeight: "bold",
                fontSize: "24px",
                margin: 0,
              }}
            >
              GAUSHALA
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {!isMobile && (
                <span>
                  {" "}
                  <strong>{user.name}</strong>
                </span>
              )}
              {/* <img src={user.picture} style={{ width: '40px', borderRadius: '50%' }} alt="profile" />/ */}
              <button
                onClick={() => setUser(null)}
                style={{
                  color: "red",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Product List Section */}
          <div style={{ marginTop: "40px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  flex: "1",
                  color: "#1f2937",
                  margin: 0,
                }}
              >
                Available Products
              </h2>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#181717",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🛒 Cart ({cart.length})
              </button>
            </div>
            {/* NEW: SEARCH & SORT UI */}
            <div
              style={{
                display: "block",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "30px",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="Search products (e.g. Gir, Ghee, Milk)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: "1",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  minWidth: "100px",
                  width: "200px",
                }}
              />
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                <option value="default">Sort by: Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>

            {/* --- RIGHT SIDE CART OVERLAY --- */}
            {isCartOpen && (
              <>
                {/* Background Backdrop (piche ka area black karne ke liye) */}
                <div
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 999,
                  }}
                />

                {/* Right Side Panel */}
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: isMobile ? "100%" : "400px",
                    height: "95vh",
                    backgroundColor: "white",
                    zIndex: 1000,
                    boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "15px",
                    }}
                  >
                    <h2 style={{ margin: 0 }}>Your Cart</h2>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div
                    style={{ flex: 1, overflowY: "auto", marginTop: "20px" }}
                  >
                    {cart.length === 0 ? (
                      <p
                        style={{
                          textAlign: "center",
                          color: "#666",
                          marginTop: "50px",
                        }}
                      >
                        Cart is empty!
                      </p>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            gap: "15px",
                            marginBottom: "20px",
                            borderBottom: "1px solid #f9f9f9",
                            paddingBottom: "10px",
                          }}
                        >
                          <img
                            src={item.img}
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                            alt={item.name}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 5px" }}>{item.name}</h4>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <button
                                onClick={() => changeQty(item.id, -1)}
                                style={{ padding: "2px 8px" }}
                              >
                                -
                              </button>
                              <span>{item.qty}</span>
                              <button
                                onClick={() => changeQty(item.id, 1)}
                                style={{ padding: "2px 8px" }}
                              >
                                +
                              </button>
                              <span
                                style={{
                                  fontWeight: "bold",
                                  marginLeft: "auto",
                                }}
                              >
                                ₹{item.price * item.qty}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div
                      style={{
                        borderTop: "2px solid #eee",
                        paddingTop: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "10px",
                          fontWeight: "bold",
                          marginBottom: "10px",
                        }}
                      >
                        <span>Total:</span>
                        <span>₹{totalAmount}</span>
                      </div>
                      <button
                        onClick={makePayment}
                        style={{
                          width: "100%",
                          padding: "15px",
                          backgroundColor: "#059669",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "18px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Proceed to Pay ₹{totalAmount}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* GRID START */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "25px",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              {processedProducts.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    textAlign: "center",
                    paddingBottom: "15px",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <h3 style={{ margin: "15px 0 5px", fontSize: "20px" }}>
                    {item.name}
                  </h3>
                  <h4 style={{ margin: "0 0 10px", color: "#161616" }}>
                    {item.item}
                  </h4>
                  <p
                    style={{
                      color: "#059669",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    ₹{item.price} / {item.unit}
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      marginTop: "10px",
                      padding: "10px 20px",
                      backgroundColor: "#181717",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      width: "80%",
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
