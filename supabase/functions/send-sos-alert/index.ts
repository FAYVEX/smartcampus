
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
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { location_lat, location_lng, user_email, user_name }: SOSAlertRequest = await req.json()

    const googleMapsUrl = `https://www.google.com/maps?q=${location_lat},${location_lng}`

    const emailResponse = await resend.emails.send({
      from: "Campus Safety <onboarding@resend.dev>",
      to: ["campus.security@example.com"], // Replace with actual security email
      subject: "⚠️ URGENT: SOS Alert Received",
      html: `
        <h1>Emergency SOS Alert</h1>
        <p>An SOS alert has been triggered by ${user_name} (${user_email}).</p>
        <h2>Location Details:</h2>
        <p>
          Latitude: ${location_lat}<br>
          Longitude: ${location_lng}<br>
          <a href="${googleMapsUrl}" style="color: #2563eb;">View Location on Google Maps</a>
        </p>
        <p style="color: #dc2626;">Please respond immediately to this emergency situation.</p>
      `,
    })

    console.log('Email sent successfully:', emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    })
  } catch (error) {
    console.error('Error sending SOS alert email:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    )
  }
}

serve(handler)
