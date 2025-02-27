import express, { Request, Response } from "express";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"] as any; // Ensure TypeScript handles this correctly
apiKey.apiKey = process.env.BREVO_API_KEY as string;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Define the request body type
interface SOSAlertRequest {
  location_lat: number;
  location_lng: number;
  user_email: string;
  user_name: string;
  recipient_email: string;
}

app.post("/send-sos", async (req: Request<{}, {}, SOSAlertRequest>, res: Response) => {
  try {
    const { location_lat, location_lng, user_email, user_name, recipient_email } = req.body;

    if (!location_lat || !location_lng || !user_email || !user_name || !recipient_email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${location_lat},${location_lng}`;

    // Email content
    const emailData = {
      sender: { name: "Campus Safety", email: "no-reply@campus.com" },
      to: [{ email: recipient_email }],
      subject: "🆘 URGENT: SOS Alert - Immediate Assistance Needed",
      htmlContent: `
        <h1>Emergency SOS Alert</h1>
        <p>An urgent help request has been received from:</p>
        <p><strong>Name:</strong> ${user_name} <br> <strong>Email:</strong> ${user_email}</p>
        <h2>Location Details:</h2>
        <p><a href="${googleMapsUrl}" style="color: #2563eb;">Click here to view location on Google Maps</a></p>
        <p style="color: #dc2626; font-weight: bold;">This person needs immediate assistance. Please respond ASAP.</p>
      `,
    };

    // Send email via Brevo API
    const response = await apiInstance.sendTransacEmail(emailData);

    console.log("✅ Email sent successfully:", response);
    res.status(200).json({ message: "🚀 SOS alert sent successfully!", response });
  } catch (error: any) {
    console.error("❌ Error sending SOS alert email:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
