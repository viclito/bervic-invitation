import nodemailer from "nodemailer";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string | null;
  city?: string | null;
  pincode?: string | null;
  totalCopies: number;
  status: string;
  notes?: string | null;
}

export interface OrderItemEmailPayload {
  templateName?: string;
  copies: number;
  previewImage?: string | null;
  customNotes?: string | null;
}

export async function sendOtpEmail(toEmail: string, otp: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F3EA; padding: 40px 20px; color: #221C17;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 2px solid #D9A441; border-radius: 20px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center;">
        <div style="width: 50px; height: 50px; background-color: #7A1F2B; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
          <span style="color: #D9A441; font-size: 24px; font-weight: bold;">✦</span>
        </div>
        <h1 style="margin: 10px 0 0 0; color: #221C17; font-size: 26px; font-weight: 700;">Bervic Invitations</h1>
        <p style="color: #7A1F2B; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px;">Verify Your Email</p>
        
        <hr style="border: none; border-top: 1px solid #EFE7D8; margin: 20px 0;" />
        
        <p style="font-size: 14px; color: #555555; line-height: 1.5;">
          Thank you for joining Bervic! Please use the 6-digit verification code below to complete your registration and verify your email address:
        </p>
        
        <div style="background-color: #F8F3EA; border: 2px dashed #7A1F2B; border-radius: 12px; padding: 15px; margin: 25px 0; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #7A1F2B;">
          ${otp}
        </div>
        
        <p style="font-size: 12px; color: #888888; margin-bottom: 0;">
          This code is valid for 10 minutes. If you did not request this registration code, please ignore this email.
        </p>
        
        <div style="margin-top: 30px; font-size: 11px; color: #aaaaaa; border-top: 1px solid #EFE7D8; padding-top: 15px;">
          © ${new Date().getFullYear()} Bervic. All rights reserved.
        </div>
      </div>
    </div>
  `;

  return await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Bervic Invitations" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `${otp} is your Bervic Verification Code`,
    html: htmlContent,
  });
}

export async function sendAdminNewOrderNotification(order: OrderEmailPayload, items: OrderItemEmailPayload[] = []) {
  const adminEmail = process.env.ADMIN_EMAIL || "berglin1998@gmail.com";
  
  const itemsHtml = items.map((item, idx) => `
    <div style="background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong style="color: #7A1F2B; font-size: 14px;">#${idx + 1} ${item.templateName || "Custom Card"}</strong>
        <span style="background-color: #FAF3E0; color: #8C6B1B; font-weight: bold; padding: 3px 10px; border-radius: 20px; font-size: 11px;">
          ${item.copies} Copies
        </span>
      </div>
      ${item.previewImage ? `
        <div style="margin: 10px 0; text-align: center;">
          <img src="${item.previewImage}" alt="Card Preview" style="max-height: 180px; border-radius: 8px; border: 1px solid #D9A441;" />
        </div>
      ` : ""}
      ${item.customNotes ? `
        <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; padding: 10px; border-radius: 6px; margin-top: 8px;">
          <strong style="color: #92400E; font-size: 11px; text-transform: uppercase;">Customer's Custom Requirements / Notes:</strong>
          <p style="margin: 4px 0 0 0; color: #78350F; font-size: 12px; white-space: pre-wrap;">${item.customNotes}</p>
        </div>
      ` : ""}
    </div>
  `).join("");

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8F3EA; padding: 30px 15px; color: #1E293B;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #D9A441; border-radius: 16px; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background-color: #7A1F2B; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
            🚨 New Customer Order Received
          </span>
          <h2 style="color: #221C17; margin: 12px 0 4px 0; font-size: 22px;">Order #${order.orderNumber}</h2>
          <p style="color: #64748B; font-size: 12px; margin: 0;">Total Requested Copies: <strong>${order.totalCopies}</strong></p>
        </div>

        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            👤 Customer Information
          </h3>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Name:</strong> ${order.customerName}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> <a href="mailto:${order.customerEmail}">${order.customerEmail}</a></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Phone:</strong> <a href="tel:${order.customerPhone}">${order.customerPhone}</a></p>
          ${order.deliveryAddress ? `
            <p style="margin: 4px 0; font-size: 13px;"><strong>Delivery Address:</strong> ${order.deliveryAddress}${order.city ? `, ${order.city}` : ""}${order.pincode ? ` - ${order.pincode}` : ""}</p>
          ` : ""}
          ${order.notes ? `
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #B45309;"><strong>Overall Order Notes:</strong> ${order.notes}</p>
          ` : ""}
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #0F172A; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">
            📦 Ordered Card Items (${items.length})
          </h3>
          ${itemsHtml}
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in"}/admin" style="background-color: #7A1F2B; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
            Open Admin Dashboard to Manage
          </a>
        </div>

      </div>
    </div>
  `;

  try {
    return await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Bervic Orders" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `🚨 New Order #${order.orderNumber} (${order.totalCopies} Copies) from ${order.customerName}`,
      html: htmlContent,
    });
  } catch (err: unknown) {
    console.error("Failed to send admin order email:", (err as Error)?.message);
  }
}

export async function sendUserOrderConfirmation(order: OrderEmailPayload, items: OrderItemEmailPayload[] = []) {
  const itemsHtml = items.map((item, idx) => `
    <div style="background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="color: #7A1F2B; font-size: 14px;">#${idx + 1} ${item.templateName || "Custom Card"}</strong>
        <span style="background-color: #FAF3E0; color: #8C6B1B; font-weight: bold; padding: 3px 10px; border-radius: 20px; font-size: 11px;">
          ${item.copies} Copies
        </span>
      </div>
      ${item.customNotes ? `
        <p style="font-size: 11px; color: #64748B; margin: 6px 0 0 0;">
          <em>Custom Instructions: ${item.customNotes}</em>
        </p>
      ` : ""}
    </div>
  `).join("");

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8F3EA; padding: 30px 15px; color: #1E293B;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #D9A441; border-radius: 16px; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 46px; height: 46px; background-color: #7A1F2B; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <span style="color: #D9A441; font-size: 22px; font-weight: bold;">✦</span>
          </div>
          <h2 style="color: #221C17; margin: 5px 0; font-size: 22px;">Thank You for Your Order!</h2>
          <p style="color: #7A1F2B; font-size: 13px; font-weight: bold; margin: 0;">Order #${order.orderNumber}</p>
        </div>

        <p style="font-size: 13px; color: #475569; line-height: 1.6;">
          Hi <strong>${order.customerName}</strong>, we have received your invitation card order! Our design and production team is reviewing your card details and custom instructions.
        </p>

        <div style="background-color: #FAF9FC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; margin: 15px 0;">
          <h4 style="margin: 0 0 8px 0; color: #0F172A; font-size: 12px; text-transform: uppercase;">Order Summary</h4>
          <p style="margin: 3px 0; font-size: 12px;"><strong>Status:</strong> <span style="color: #D97706; font-weight: bold;">${order.status}</span></p>
          <p style="margin: 3px 0; font-size: 12px;"><strong>Total Copies:</strong> ${order.totalCopies}</p>
          ${order.deliveryAddress ? `
            <p style="margin: 3px 0; font-size: 12px;"><strong>Delivery To:</strong> ${order.deliveryAddress}${order.city ? `, ${order.city}` : ""} ${order.pincode || ""}</p>
          ` : ""}
        </div>

        <div style="margin: 15px 0;">
          <h4 style="margin: 0 0 8px 0; color: #0F172A; font-size: 12px; text-transform: uppercase;">Items in this order</h4>
          ${itemsHtml}
        </div>

        <div style="background-color: #FEF3C7; border-radius: 10px; padding: 12px; margin-top: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #92400E; font-weight: 600;">
            ✨ We will notify you via email as soon as your design proof is ready or when the status changes!
          </p>
        </div>

        <div style="margin-top: 25px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 15px;">
          If you have any questions, simply reply to this email. © ${new Date().getFullYear()} Bervic Invitations.
        </div>

      </div>
    </div>
  `;

  try {
    return await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Bervic Invitations" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      subject: `✨ Order Confirmed: #${order.orderNumber} - Bervic Invitations`,
      html: htmlContent,
    });
  } catch (err: unknown) {
    console.error("Failed to send user confirmation email:", (err as Error)?.message);
  }
}

export async function sendUserOrderStatusUpdate(order: OrderEmailPayload, newStatus: string, optionalNote?: string) {
  const statusLabels: Record<string, { label: string; color: string; desc: string }> = {
    PENDING: { label: "Pending Review", color: "#F59E0B", desc: "Your order is pending initial review by our design specialists." },
    CONFIRMED: { label: "Order Confirmed", color: "#10B981", desc: "Your order details have been verified and confirmed." },
    IN_PRODUCTION: { label: "In Production / Printing", color: "#3B82F6", desc: "Your cards are currently in production and high-resolution printing." },
    SHIPPED: { label: "Shipped & Dispatched", color: "#8B5CF6", desc: "Your package is on its way to your delivery address!" },
    DELIVERED: { label: "Delivered", color: "#059669", desc: "Your invitation cards have been successfully delivered. Thank you for choosing Bervic!" },
    CANCELLED: { label: "Cancelled", color: "#EF4444", desc: "This order has been marked as cancelled." },
  };

  const currentStatusInfo = statusLabels[newStatus] || { label: newStatus, color: "#7A1F2B", desc: "Your order status has been updated." };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8F3EA; padding: 30px 15px; color: #1E293B;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #D9A441; border-radius: 16px; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #221C17; margin: 0 0 6px 0; font-size: 20px;">Order Status Update</h2>
          <p style="color: #7A1F2B; font-size: 13px; font-weight: bold; margin: 0;">Order #${order.orderNumber}</p>
        </div>

        <div style="background-color: #F8FAFC; border: 2px solid ${currentStatusInfo.color}; border-radius: 12px; padding: 18px; text-align: center; margin: 15px 0;">
          <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748B; letter-spacing: 1px;">Current Status</span>
          <h3 style="color: ${currentStatusInfo.color}; margin: 6px 0; font-size: 20px;">${currentStatusInfo.label}</h3>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">${currentStatusInfo.desc}</p>
        </div>

        ${optionalNote ? `
          <div style="background-color: #FAF3E0; border-left: 4px solid #D9A441; border-radius: 6px; padding: 12px; margin: 15px 0;">
            <strong style="color: #8C6B1B; font-size: 11px; text-transform: uppercase;">Note from Bervic Team:</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #221C17;">${optionalNote}</p>
          </div>
        ` : ""}

        <div style="margin-top: 25px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 15px;">
          Need assistance? Reply directly to this email. © ${new Date().getFullYear()} Bervic Invitations.
        </div>

      </div>
    </div>
  `;

  try {
    return await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Bervic Orders" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      subject: `📦 Order #${order.orderNumber} Status: ${currentStatusInfo.label}`,
      html: htmlContent,
    });
  } catch (err: unknown) {
    console.error("Failed to send status update email:", (err as Error)?.message);
  }
}

export async function sendUserOrderMessageNotification(order: OrderEmailPayload, messageText: string) {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8F3EA; padding: 30px 15px; color: #1E293B;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #D9A441; border-radius: 16px; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #221C17; margin: 0 0 6px 0; font-size: 20px;">New Message From Bervic</h2>
          <p style="color: #7A1F2B; font-size: 13px; font-weight: bold; margin: 0;">Regarding Order #${order.orderNumber}</p>
        </div>

        <div style="background-color: #FAF9FC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 15px 0;">
          <p style="font-size: 11px; font-weight: bold; color: #7A1F2B; text-transform: uppercase; margin: 0 0 6px 0;">
            Message from Support Specialist:
          </p>
          <p style="font-size: 14px; color: #1E293B; line-height: 1.6; margin: 0; white-space: pre-wrap;">
            ${messageText}
          </p>
        </div>

        <div style="background-color: #FAF3E0; border-radius: 8px; padding: 12px; text-align: center; margin-top: 15px;">
          <p style="margin: 0; font-size: 12px; color: #8C6B1B; font-weight: 600;">
            💡 You can reply directly to this email to respond to our team.
          </p>
        </div>

        <div style="margin-top: 25px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 15px;">
          © ${new Date().getFullYear()} Bervic Invitations. All rights reserved.
        </div>

      </div>
    </div>
  `;

  try {
    return await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Bervic Team" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      subject: `💬 New Message regarding Order #${order.orderNumber}`,
      html: htmlContent,
    });
  } catch (err: unknown) {
    console.error("Failed to send message email:", (err as Error)?.message);
  }
}
