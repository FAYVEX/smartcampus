
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
}

interface SOSAlertRequest {
  location_lat: number;
  location_lng: number;
  user_email: string;
  user_name: string;
  recipient_email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { location_lat, location_lng, user_email, user_name, recipient_email }: SOSAlertRequest = await req.json()

    const googleMapsUrl = `https://www.google.com/maps?q=${location_lat},${location_lng}`

    const emailResponse = await resend.emails.send({
      from: "Campus Safety <onboarding@resend.dev>",
      to: [recipient_email],
      subject: "🆘 URGENT: SOS Alert - Immediate Assistance Needed",
      html: `
        <h1>Emergency SOS Alert</h1>
        <p>An urgent help request has been received from:</p>
        <p>
          Name: ${user_name}<br>
          Email: ${user_email}
        </p>
        <h2>Location Details:</h2>
        <p>
          <a href="${googleMapsUrl}" style="color: #2563eb;">Click here to view location on Google Maps</a>
        </p>
        <p style="color: #dc2626; font-weight: bold;">This person needs immediate assistance. Please respond as soon as possible.</p>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    })
  } catch (error) {
    console.error('Error sending SOS alert email:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    )
  }
}

serve(handler)
