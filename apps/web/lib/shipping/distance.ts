/**
 * Bervic Invitation - Distance & Shipping Calculation Engine
 * 
 * Origin: Kanyakumari, Tamil Nadu, India (Lat: 8.0883° N, Lng: 77.5385° E)
 * 
 * Business Logic:
 * - Within 800 km radius of Kanyakumari: FREE Delivery (₹0).
 *   (Covers all of Tamil Nadu, Kerala, Pondicherry, Bengaluru/South Karnataka, Southern AP).
 * - Beyond 800 km radius: Assigned standard courier shipping charge (₹150 for 801-1500km, ₹250 for >1500km).
 * - The 800 km distance rule is computed silently behind the scenes without user-facing rule disclosures.
 */

export const KANYAKUMARI_COORDINATES = {
  lat: 8.0883,
  lng: 77.5385,
  name: "Kanyakumari, Tamil Nadu",
};

export const FREE_DELIVERY_RADIUS_KM = 800;

// Coordinate centroids for Indian Postal 2-digit & key 3-digit PIN prefixes
const PINCODE_PREFIX_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Specific 3-digit overrides in Tamil Nadu & Kerala
  "629": { lat: 8.1833, lng: 77.4119 }, // Kanyakumari District / Nagercoil (~15 km)
  "627": { lat: 8.7139, lng: 77.7567 }, // Tirunelveli (~75 km)
  "628": { lat: 8.7642, lng: 78.1348 }, // Thoothukudi / Tuticorin (~110 km)
  "626": { lat: 9.5872, lng: 77.9514 }, // Virudhunagar (~180 km)
  "625": { lat: 9.9252, lng: 78.1198 }, // Madurai (~220 km)
  "624": { lat: 10.3673, lng: 77.9803 }, // Dindigul (~280 km)
  "620": { lat: 10.7905, lng: 78.7047 }, // Tiruchirappalli (~340 km)
  "600": { lat: 13.0827, lng: 80.2707 }, // Chennai City (~660 km)
  "641": { lat: 11.0168, lng: 76.9558 }, // Coimbatore (~380 km)
  "636": { lat: 11.6643, lng: 78.1460 }, // Salem (~430 km)
  "632": { lat: 12.9165, lng: 79.1325 }, // Vellore (~580 km)
  "682": { lat: 9.9312, lng: 76.2673 },  // Kochi / Ernakulam (~230 km)
  "695": { lat: 8.5241, lng: 76.9366 },  // Thiruvananthapuram (~70 km)
  "691": { lat: 8.8932, lng: 76.6141 },  // Kollam (~120 km)
  "680": { lat: 10.5276, lng: 76.2144 }, // Thrissur (~290 km)
  "673": { lat: 11.2588, lng: 75.7804 }, // Kozhikode (~390 km)
  "670": { lat: 11.8745, lng: 75.3704 }, // Kannur (~470 km)
  "560": { lat: 12.9716, lng: 77.5946 }, // Bengaluru Urban (~540 km)
  "570": { lat: 12.2958, lng: 76.6394 }, // Mysuru (~460 km)
  "575": { lat: 12.9141, lng: 74.8560 }, // Mangaluru (~560 km)
  "500": { lat: 17.3850, lng: 78.4867 }, // Hyderabad (~1035 km)
  "400": { lat: 18.9220, lng: 72.8347 }, // Mumbai (~1250 km)
  "411": { lat: 18.5204, lng: 73.8567 }, // Pune (~1150 km)
  "110": { lat: 28.6139, lng: 77.2090 }, // New Delhi (~2280 km)
  "700": { lat: 22.5726, lng: 88.3639 }, // Kolkata (~1900 km)

  // 2-digit Circle Fallbacks
  "11": { lat: 28.6139, lng: 77.2090 }, // Delhi
  "12": { lat: 28.4595, lng: 77.0266 }, // Gurgaon / Haryana
  "13": { lat: 29.9695, lng: 76.8783 }, // Ambala / Haryana
  "14": { lat: 30.9010, lng: 75.8573 }, // Ludhiana / Punjab
  "15": { lat: 30.2110, lng: 74.9455 }, // Bathinda / Punjab
  "16": { lat: 30.7333, lng: 76.7794 }, // Chandigarh
  "17": { lat: 31.1048, lng: 77.1734 }, // Himachal Pradesh
  "18": { lat: 32.7266, lng: 74.8570 }, // Jammu
  "19": { lat: 34.0837, lng: 74.7973 }, // Srinagar / Kashmir
  "20": { lat: 27.8974, lng: 78.0880 }, // Aligarh / UP
  "21": { lat: 25.4358, lng: 81.8463 }, // Prayagraj / UP
  "22": { lat: 26.8467, lng: 80.9462 }, // Lucknow / UP
  "23": { lat: 25.1337, lng: 82.5644 }, // Mirzapur / UP
  "24": { lat: 30.3165, lng: 78.0322 }, // Dehradun / Uttarakhand
  "25": { lat: 28.9845, lng: 77.7064 }, // Meerut / UP
  "26": { lat: 29.3803, lng: 79.4636 }, // Bareilly / Uttarakhand
  "27": { lat: 26.7606, lng: 83.3732 }, // Gorakhpur / UP
  "28": { lat: 25.4484, lng: 78.5685 }, // Jhansi / UP
  "30": { lat: 26.9124, lng: 75.7873 }, // Jaipur / Rajasthan
  "31": { lat: 24.5854, lng: 73.7125 }, // Udaipur / Rajasthan
  "32": { lat: 25.2138, lng: 75.8648 }, // Kota / Rajasthan
  "33": { lat: 28.0229, lng: 73.3119 }, // Bikaner / Rajasthan
  "34": { lat: 26.2389, lng: 73.0243 }, // Jodhpur / Rajasthan
  "36": { lat: 22.3039, lng: 70.8022 }, // Rajkot / Gujarat
  "37": { lat: 23.2420, lng: 69.6669 }, // Kutch / Gujarat
  "38": { lat: 23.0225, lng: 72.5714 }, // Ahmedabad / Gujarat
  "39": { lat: 21.1702, lng: 72.8311 }, // Surat / Gujarat
  "40": { lat: 18.9220, lng: 72.8347 }, // Mumbai / Maharashtra
  "41": { lat: 18.5204, lng: 73.8567 }, // Pune / Maharashtra
  "42": { lat: 19.9975, lng: 73.7898 }, // Nashik / Maharashtra
  "43": { lat: 19.8762, lng: 75.3433 }, // Aurangabad / Maharashtra
  "44": { lat: 21.1458, lng: 79.0882 }, // Nagpur / Maharashtra
  "45": { lat: 22.7196, lng: 75.8577 }, // Indore / MP
  "46": { lat: 23.2599, lng: 77.4126 }, // Bhopal / MP
  "47": { lat: 26.2183, lng: 78.1828 }, // Gwalior / MP
  "48": { lat: 23.1815, lng: 79.9864 }, // Jabalpur / MP
  "49": { lat: 21.2514, lng: 81.6296 }, // Raipur / Chhattisgarh
  "50": { lat: 17.3850, lng: 78.4867 }, // Hyderabad / Telangana
  "51": { lat: 13.6288, lng: 79.4192 }, // Tirupati / South AP (~640 km)
  "52": { lat: 16.5062, lng: 80.6480 }, // Vijayawada / AP (~940 km)
  "53": { lat: 17.6868, lng: 83.2185 }, // Visakhapatnam / AP (~1250 km)
  "56": { lat: 12.9716, lng: 77.5946 }, // Bengaluru / Karnataka (~540 km)
  "57": { lat: 12.2958, lng: 76.6394 }, // Mysuru / Karnataka (~460 km)
  "58": { lat: 15.3647, lng: 75.1240 }, // Hubballi / Karnataka (~880 km)
  "59": { lat: 15.8497, lng: 74.4977 }, // Belagavi / Karnataka (~950 km)
  "60": { lat: 13.0827, lng: 80.2707 }, // Chennai / TN (~660 km)
  "61": { lat: 10.7905, lng: 79.1378 }, // Thanjavur / TN (~360 km)
  "62": { lat: 9.9252, lng: 78.1198 },  // Madurai / TN (~220 km)
  "63": { lat: 11.6643, lng: 78.1460 }, // Salem / TN (~430 km)
  "64": { lat: 11.0168, lng: 76.9558 }, // Coimbatore / TN (~380 km)
  "67": { lat: 11.2588, lng: 75.7804 }, // Kozhikode / Kerala (~380 km)
  "68": { lat: 9.9312, lng: 76.2673 },  // Kochi / Kerala (~230 km)
  "69": { lat: 8.5241, lng: 76.9366 },  // Thiruvananthapuram / Kerala (~70 km)
  "70": { lat: 22.5726, lng: 88.3639 }, // Kolkata / West Bengal
  "71": { lat: 22.5958, lng: 88.2636 }, // Howrah / WB
  "72": { lat: 22.4257, lng: 87.3199 }, // Midnapore / WB
  "73": { lat: 26.7271, lng: 88.3953 }, // Siliguri / North Bengal
  "74": { lat: 22.7210, lng: 88.4798 }, // 24 Parganas / WB
  "75": { lat: 20.2961, lng: 85.8245 }, // Bhubaneswar / Odisha
  "76": { lat: 19.3149, lng: 84.7941 }, // Berhampur / Odisha
  "77": { lat: 21.4669, lng: 83.9812 }, // Sambalpur / Odisha
  "78": { lat: 26.1445, lng: 91.7362 }, // Assam / Northeast
  "79": { lat: 24.8170, lng: 93.9368 }, // Manipur, Meghalaya, etc.
  "80": { lat: 25.5941, lng: 85.1376 }, // Patna / Bihar
  "81": { lat: 25.2425, lng: 86.9842 }, // Bhagalpur / Bihar
  "82": { lat: 24.7914, lng: 85.0002 }, // Gaya / Bihar
  "83": { lat: 23.3441, lng: 85.3096 }, // Ranchi / Jharkhand
  "84": { lat: 26.1209, lng: 85.3647 }, // Muzaffarpur / Bihar
  "85": { lat: 25.7711, lng: 87.4753 }, // Purnia / Bihar
};

/**
 * Calculates geodesic distance between two latitude/longitude points using Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface ShippingCalculationResult {
  pincode: string;
  distanceKm: number;
  isWithin800Km: boolean;
  shippingFee: number;
  deliveryEstimateDays: string;
  shippingLabel: string;
}

/**
 * Computes distance from Kanyakumari origin and determines the shipping charge.
 * 
 * Rules:
 * - If pincode is not provided or incomplete, defaults to FREE delivery.
 * - If within 800 km: shippingFee is 0.
 * - If beyond 800 km: shippingFee is assigned (e.g. ₹150 for 801-1500km, ₹250 for >1500km).
 */
export function calculateShippingByPincode(pincode: string): ShippingCalculationResult {
  const cleanPin = String(pincode || "").replace(/\D/g, "").trim();

  // If no 6-digit pin, default to standard local free shipping
  if (cleanPin.length < 2) {
    return {
      pincode: cleanPin,
      distanceKm: 0,
      isWithin800Km: true,
      shippingFee: 0,
      deliveryEstimateDays: "3-5 Business Days",
      shippingLabel: "FREE Doorstep Delivery",
    };
  }

  // Look up coordinates (try 3-digit prefix first, then 2-digit prefix)
  const prefix3 = cleanPin.slice(0, 3);
  const prefix2 = cleanPin.slice(0, 2);
  const targetCoords = PINCODE_PREFIX_COORDINATES[prefix3] || PINCODE_PREFIX_COORDINATES[prefix2];

  if (!targetCoords) {
    // If unknown prefix, evaluate by first digit (6 = South [mostly <= 800], others = North/East/West [> 800])
    const firstDigit = cleanPin[0];
    if (firstDigit === "6") {
      return {
        pincode: cleanPin,
        distanceKm: 350,
        isWithin800Km: true,
        shippingFee: 0,
        deliveryEstimateDays: "3-4 Business Days",
        shippingLabel: "FREE Doorstep Delivery",
      };
    }

    // Default for farther states (> 800 km)
    return {
      pincode: cleanPin,
      distanceKm: 1600,
      isWithin800Km: false,
      shippingFee: 150,
      deliveryEstimateDays: "5-7 Business Days",
      shippingLabel: "Standard Courier Delivery",
    };
  }

  const distanceKm = calculateHaversineDistanceKm(
    KANYAKUMARI_COORDINATES.lat,
    KANYAKUMARI_COORDINATES.lng,
    targetCoords.lat,
    targetCoords.lng
  );

  const isWithin800Km = distanceKm <= FREE_DELIVERY_RADIUS_KM;

  // Determine rate
  let shippingFee = 0;
  if (!isWithin800Km) {
    // For runs beyond 800 km: standard express courier
    shippingFee = distanceKm > 1500 ? 250 : 150;
  }

  return {
    pincode: cleanPin,
    distanceKm,
    isWithin800Km,
    shippingFee,
    deliveryEstimateDays: isWithin800Km ? "3-4 Business Days" : "5-7 Business Days",
    shippingLabel: isWithin800Km ? "FREE Doorstep Delivery" : "Standard Courier Delivery",
  };
}
