# React Native API Integration Guide & Endpoints

> **Backend Host:** `https://your-domain.com` (or `http://localhost:3000` during local development)  
> **Auth Scheme:** Bearer JWT Token / Session Cookie in HTTP Header  
> **Content-Type:** `application/json` (or `multipart/form-data` for file uploads)

---

## 1. Authentication & User Management

### 1.1 Login (Credentials)
* **Endpoint:** `POST /api/auth/callback/credentials` or custom `POST /api/auth/mobile-login`
* **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Response:**
  ```json
  {
    "user": {
      "id": "cuid_123",
      "email": "user@example.com",
      "name": "Jane Doe",
      "plan": "PRO_1799",
      "role": "USER",
      "allowedTemplatesCount": 5,
      "allowedCardsCount": 10
    },
    "token": "jwt_token_here"
  }
  ```

### 1.2 Send OTP / Verify OTP
* **Send OTP:** `POST /api/auth/send-otp`  
  `Body: { "email": "user@example.com" }`
* **Verify OTP:** `POST /api/auth/verify-otp`  
  `Body: { "email": "user@example.com", "code": "123456" }`

---

## 2. Event Drafts & OCR Auto-Extraction

### 2.1 Get Active Event Draft Profile
* **Endpoint:** `GET /api/user/event-draft`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Response:**
  ```json
  {
    "id": "draft_123",
    "userId": "cuid_123",
    "profileName": "Sasa & Allan's Wedding",
    "isActive": true,
    "eventType": "WEDDING",
    "hostNameOne": "Allan",
    "hostNameTwo": "Sasa",
    "coupleInitials": "A & S",
    "eventDate": "2026-11-20",
    "eventTime": "10:30 AM",
    "venueName": "The Grand Palace",
    "venueAddress": "123 Royale Boulevard",
    "venueMapUrl": "https://maps.google.com/?q=...",
    "locationsJson": "[{\"title\":\"Ceremony\",\"address\":\"...\"}]",
    "functionsJson": "[{\"title\":\"Sangeet Night\",\"date\":\"...\"}]",
    "dayTimelineJson": "[{\"time\":\"10:00 AM\",\"activity\":\"Arrival\"}]",
    "loveStoryText": "We met on a sunny afternoon in 2020...",
    "coverImage": "https://res.cloudinary.com/...",
    "galleryImagesJson": "[\"https://...\", \"https://...\"]",
    "completedFields": "[\"hostNameOne\",\"hostNameTwo\",\"eventDate\"]",
    "currentStep": 3,
    "isComplete": true
  }
  ```

### 2.2 Save / Update Event Draft
* **Endpoint:** `POST /api/user/event-draft`
* **Request Body:** Partial or complete JSON matching `UserDraftDetails` fields.

### 2.3 OCR Auto-Extraction from Card Photo
* **Endpoint:** `POST /api/user/event-draft/extract`
* **Request Body (JSON or Form-Data):**
  ```json
  {
    "imageUri": "data:image/jpeg;base64,..." 
  }
  ```
* **Response:** Automatically extracted fields:
  ```json
  {
    "success": true,
    "extracted": {
      "hostNameOne": "Allan",
      "hostNameTwo": "Sasa",
      "eventDate": "2026-11-20",
      "venueName": "The Grand Palace",
      "venueAddress": "123 Royale Boulevard"
    }
  }
  ```

---

## 3. Invitations & Templates

### 3.1 Check Slug Availability
* **Endpoint:** `POST /api/invitations/check-slug`
* **Request Body:** `{ "slug": "allan-and-sasa-2026" }`
* **Response:** `{ "available": true }`

### 3.2 Save / Publish Invitation Website
* **Endpoint:** `POST /api/invitations/save`
* **Request Body:** Full `UserInvitation` payload with template slug, couple data, timeline, and gallery.

### 3.3 List User's Saved Invitations
* **Endpoint:** `GET /api/invitations/my-invitations`
* **Response:** Array of user's active digital invitations with view counts and RSVP totals.

---

## 4. Guests & RSVP Engine

### 4.1 Get Guest List
* **Endpoint:** `GET /api/invitations/{id}/guests`
* **Response:**
  ```json
  [
    {
      "id": "guest_001",
      "name": "Michael Scott",
      "phone": "+919876543210",
      "email": "michael@dunder.com",
      "status": "ATTENDING",
      "plusOnes": 1,
      "dietaryNotes": "Vegetarian",
      "uniqueCode": "clz12345",
      "whatsappSentAt": "2026-08-20T10:00:00Z"
    }
  ]
  ```

### 4.2 Add / Update Guest
* **Endpoint:** `POST /api/invitations/{id}/guests`
* **Request Body:** `{ "name": "Dwight Schrute", "phone": "+919876543211", "plusOnes": 0 }`

### 4.3 Batch Guest Import (from Mobile Contacts or CSV)
* **Endpoint:** `POST /api/invitations/{id}/guests/batch`
* **Request Body:**
  ```json
  {
    "guests": [
      { "name": "Pam Beesly", "phone": "+919876543212" },
      { "name": "Jim Halpert", "phone": "+919876543213" }
    ]
  }
  ```

### 4.4 Guest Check-in via QR Code Scan (Venue Door App)
* **Endpoint:** `POST /api/invitations/{id}/checkin`
* **Request Body:** `{ "uniqueCode": "clz12345" }`
* **Response:**
  ```json
  {
    "success": true,
    "guest": {
      "name": "Michael Scott",
      "status": "ATTENDING",
      "plusOnes": 1,
      "checkedInAt": "2026-11-20T10:15:00Z"
    }
  }
  ```

---

## 5. Shop, Cart & Physical Card Orders

### 5.1 List Physical Shop Products
* **Endpoint:** `GET /api/shop/products`
* **Query Params:** `?category=royal&page=1`
* **Response:** Array of `ShopProduct` items (images, prices, min copies, paper stock).

### 5.2 Cart Operations
* **Get Cart:** `GET /api/cart`
* **Add to Cart:** `POST /api/cart`  
  `Body: { "templateId": "...", "copies": 100, "cardDetailsJson": "...", "price": 6500 }`
* **Remove from Cart:** `DELETE /api/cart?id=cart_item_id`

### 5.3 Create Razorpay Order
* **Endpoint:** `POST /api/payment/create-order`
* **Request Body:** `{ "amount": 6500, "plan": "CARD_ORDER", "type": "ORDER" }`
* **Response:** `{ "orderId": "order_98765", "key": "rzp_live_xxx", "amount": 650000 }`

### 5.4 Verify Payment & Confirm Order
* **Endpoint:** `POST /api/payment/verify`
* **Request Body:**
  ```json
  {
    "razorpayOrderId": "order_98765",
    "razorpayPaymentId": "pay_12345",
    "razorpaySignature": "sig_xxx",
    "deliveryAddress": "45 Rosewood St, Mumbai",
    "city": "Mumbai",
    "pincode": "400001",
    "customerName": "Jane Doe",
    "customerPhone": "+919876543210"
  }
  ```

### 5.5 Order Chat & Messages
* **Get Messages:** `GET /api/user/orders/{id}`
* **Post Message:** `POST /api/user/orders/{id}/message`  
  `Body: { "message": "Can we change the gold foil text color to crimson red?" }`

---

## 6. Media & Asset Uploads

### 6.1 Upload Image to Cloudinary
* **Endpoint:** `POST /api/upload`
* **Content-Type:** `multipart/form-data`
* **Form Field:** `file` (Binary image buffer)
* **Response:**
  ```json
  {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/bervic/invitation.jpg"
  }
  ```
