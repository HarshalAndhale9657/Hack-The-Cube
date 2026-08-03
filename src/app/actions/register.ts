"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { google } from "googleapis";

// Define the shape of our incoming form data based on the frontend RegistrationForm
export interface RegistrationData {
  type: "individual" | "team";
  teamName: string;
  tshirtSize: string;
  dietaryPreference: string;
  members: Array<{
    fullName: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    department: string;
  }>;
}

export interface PaymentVerificationData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * 1. Create a Razorpay Order
 * Called when the user clicks "Pay & Register"
 */
export async function createRazorpayOrder(amountInRupees: number) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials are not configured.");
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInRupees * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    
    return { success: true, orderId: order.id, amount: order.amount };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return { success: false, error: "Failed to create payment order. Please try again later." };
  }
}

/**
 * 2. Verify Payment and Save to Google Sheets
 * Called after successful payment on the frontend
 */
export async function verifyPaymentAndRegister(
  paymentData: PaymentVerificationData,
  formData: RegistrationData
) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error("Razorpay secret is not configured.");
    }

    // Verify the payment signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return { success: false, error: "Payment verification failed. Invalid signature." };
    }

    // If payment is verified, save to Google Sheets
    await saveToGoogleSheets(paymentData, formData);

    return { success: true, message: "Registration successful!" };
  } catch (error) {
    console.error("Error verifying payment or registering:", error);
    return { success: false, error: "Registration failed during saving process. Please contact support with your payment ID." };
  }
}

/**
 * Helper function to append a row to Google Sheets
 */
async function saveToGoogleSheets(
  paymentData: PaymentVerificationData,
  formData: RegistrationData
) {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.warn("Google Sheets credentials are not fully configured. Skipping sheet update.");
    return;
  }

  // Handle potential escaped newlines in the private key string from .env
  const formattedPrivateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: formattedPrivateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Format the row data
  // We'll flatten the data into a single array. 
  // Schema: [Timestamp, Type, TeamName, LeaderName, LeaderEmail, LeaderPhone, LeaderCollege, LeaderYear, LeaderDept, TeamSize, TShirt, Dietary, PaymentID, OrderID, MembersDataJSON]
  const leader = formData.members[0];
  const timestamp = new Date().toISOString();
  
  // We'll store the extra members as a JSON string for simplicity, 
  // or they could be flattened into additional columns depending on the exact sheet structure.
  const extraMembersJson = formData.members.length > 1 
    ? JSON.stringify(formData.members.slice(1)) 
    : "";

  const row = [
    timestamp,
    formData.type,
    formData.teamName || "N/A",
    leader.fullName,
    leader.email,
    leader.phone,
    leader.college,
    leader.year,
    leader.department,
    formData.members.length,
    formData.tshirtSize,
    formData.dietaryPreference,
    paymentData.razorpay_payment_id,
    paymentData.razorpay_order_id,
    extraMembersJson
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: "Sheet1!A:O", // Adjust "Sheet1" if your sheet is named differently
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}
