"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function MobileCheckoutInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const amount = searchParams.get("amount") || "59900";
  const keyId = searchParams.get("keyId") || "rzp_test_TJjdhQ40H2NION";
  const plan = searchParams.get("plan") || "BASIC_599";
  const planTitle = searchParams.get("planTitle") || "Subscription Plan";
  const name = searchParams.get("name") || "Customer";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  const [statusText, setStatusText] = useState("Opening Razorpay Gateway...");
  const [errorText, setErrorText] = useState<string | null>(null);

  const notifyNative = (type: string, payload: any) => {
    if (typeof window !== "undefined" && (window as any).ReactNativeWebView?.postMessage) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({ type, payload })
      );
    }
  };

  useEffect(() => {
    if (!orderId) {
      setErrorText("Missing payment order ID.");
      notifyNative("ERROR", { message: "Missing order ID." });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      try {
        const options = {
          key: keyId,
          amount: parseInt(amount, 10),
          currency: "INR",
          name: "Bervic Invitations",
          description: planTitle,
          order_id: orderId,
          prefill: {
            name,
            email,
            contact: phone,
          },
          theme: {
            color: "#991B1B",
          },
          modal: {
            ondismiss: function () {
              notifyNative("CANCELLED", {});
            },
            backdropclose: false,
            escape: true,
            handleback: true,
          },
          retry: {
            enabled: true,
            max_count: 4,
          },
          handler: async function (response: any) {
            setStatusText("Verifying Payment with Server...");
            try {
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || verifyData.error) {
                throw new Error(verifyData.error || "Payment verification failed.");
              }

              setStatusText("Payment Successful! 🎉");
              notifyNative("SUCCESS", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                verifyData,
              });
            } catch (err: any) {
              setErrorText(err?.message || "Verification failed.");
              notifyNative("ERROR", { message: err?.message || "Verification failed." });
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err: any) {
        setErrorText(err?.message || "Failed to initialize Razorpay.");
        notifyNative("ERROR", { message: err?.message || "Initialization error." });
      }
    };

    script.onerror = () => {
      setErrorText("Failed to load Razorpay Checkout SDK.");
      notifyNative("ERROR", { message: "Failed to load Razorpay script." });
    };

    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch {}
    };
  }, [orderId, amount, keyId, plan, planTitle, name, email, phone]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#FEF2F2",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          padding: "32px 24px",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(153, 27, 27, 0.08)",
          maxWidth: "360px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            border: "4px solid #FEE2E2",
            borderTopColor: "#DC2626",
            borderRadius: "50%",
            marginBottom: "16px",
          }}
        />
        <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0" }}>
          {errorText ? "Payment Error" : statusText}
        </h2>
        <p style={{ fontSize: "12px", fontWeight: "600", color: "#64748B", margin: 0, lineHeight: "1.4" }}>
          {errorText
            ? errorText
            : "Official 256-Bit SSL Encrypted Gateway • UPI / Cards / NetBanking"}
        </p>
      </div>
    </div>
  );
}

export default function MobileCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#FEF2F2",
          }}
        >
          <p>Loading Checkout...</p>
        </div>
      }
    >
      <MobileCheckoutInner />
    </Suspense>
  );
}
