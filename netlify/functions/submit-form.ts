export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = await req.json();
    const { kind, name, email, phone, brief } = data;

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Valid email required" }), { status: 400 });
    }

    const subject = kind === "newsletter" ? "Newsletter signup" : `Project — ${name || "Inquiry"}`;
    const message =
      kind === "newsletter"
        ? `Please add this address to the USSCALLISTER newsletter.\n\n${email}`
        : `${name || ""}\n${email}\n${phone || ""}\n\n${brief || ""}`;

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: "d557e72f-ae6b-4b5e-8c6d-cba65ec3b60f",
        name: name || "Newsletter",
        email,
        phone: phone || "",
        message,
        subject,
        from_name: "USSCALLISTER Website",
      }),
    });

    const payload = await response.json().catch(() => null);
    const ok = response.ok && payload?.success === true;

    if (!ok) {
      return new Response(JSON.stringify({ error: payload?.message || "Web3Forms failed" }), { status: 502 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to send" }), { status: 500 });
  }
};
