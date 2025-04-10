import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma" // Adjust the path based on your project structure

export async function POST(req: Request) {
  console.log("Received Clerk webhook request")

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error: Missing svix headers", { svix_id, svix_timestamp })
    return new Response("Error: Missing svix headers", {
      status: 400,
    })
  }

  // Get the body
  let payload
  try {
    payload = await req.json()
  } catch (err) {
    console.error("Error parsing webhook body:", err)
    return new Response("Error parsing request body", {
      status: 400,
    })
  }

  const body = JSON.stringify(payload)

  // Verify webhook secret exists
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    console.error("Error: CLERK_WEBHOOK_SECRET is not defined")
    return new Response("Error: Webhook secret not configured", {
      status: 500,
    })
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", {
      status: 400,
    })
  }

  // Handle the webhook event
  const eventType = evt.type
  console.log(`Processing webhook event: ${eventType}`)

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data

    // Get the primary email
    const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id)

    if (primaryEmail) {
      try {
        // Create or update user in your database
        const user = await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            email: primaryEmail.email_address,
            firstName: first_name || "",
            lastName: last_name || "",
          },
          create: {
            clerkId: id,
            email: primaryEmail.email_address,
            firstName: first_name || "",
            lastName: last_name || "",
          },
        })

        console.log(`User ${id} ${eventType === "user.created" ? "created" : "updated"} successfully`, {
          userId: user.id,
        })

        return new Response(JSON.stringify({ success: true, userId: user.id }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      } catch (error) {
        console.error("Error saving user to database:", error)
        return new Response(JSON.stringify({ error: "Error saving user to database" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      }
    } else {
      console.error("No primary email found for user", id)
      return new Response(JSON.stringify({ error: "No primary email found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  // For other event types
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}