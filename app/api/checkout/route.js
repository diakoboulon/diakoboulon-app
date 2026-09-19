import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SENEPAY_API_URL = "https://api.sene-pay.com/api/v1/checkout/sessions";

// Crée une session de paiement SenePay (Orange Money, Moov Africa, Wave...)
// et renvoie l'URL de la page de paiement hébergée vers laquelle rediriger
// le client. Si les clés SenePay ne sont pas configurées (.env.local), la
// commande est simplement simulée — utile pour développer sans compte marchand.
export async function POST(request) {
  const body = await request.json();

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ ok: false, error: "Panier vide" }, { status: 400 });
  }

  const apiKey = process.env.SENEPAY_API_KEY;
  const apiSecret = process.env.SENEPAY_API_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Enregistre la commande dans la base (si Supabase est configuré) pour qu'on
  // puisse la retrouver ensuite, quel que soit le mode de paiement choisi.
  let orderId = `DK-${Date.now()}`;
  let debugError = null;
  if (supabaseAdmin) {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        client_id: body.clientId || null,
        items: body.items.map((i) => ({
          product_id: i.product?.id,
          name: i.product?.name,
          qty: i.qty,
          price: i.product?.price,
        })),
        total: body.total,
        payment_method: body.pay,
        status: body.pay === "livraison" ? "en_preparation" : "en_attente_paiement",
      })
      .select()
      .single();
    if (!error && order) {
      orderId = order.id;
    } else if (error) {
      console.error("Erreur enregistrement commande Supabase :", error.message, error.details, error.hint);
      debugError = error.message;
    }
  } else {
    debugError = "supabaseAdmin non initialisé (clé service manquante ou URL manquante).";
  }
  const orderReference = orderId;

  // Mode démonstration : pas de clés SenePay configurées.
  if (!apiKey || !apiSecret) {
    console.log("SenePay non configuré — commande simulée :", body);
    return NextResponse.json({ ok: true, simulated: true, orderId: orderReference, debugError });
  }

  // Paiement à la livraison : pas besoin de passer par SenePay, on confirme directement.
  if (body.pay === "livraison") {
    console.log("Commande à payer à la livraison :", orderReference, body);
    return NextResponse.json({ ok: true, simulated: true, orderId: orderReference, debugError });
  }

  try {
    const res = await fetch(SENEPAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
        "X-Api-Secret": apiSecret,
      },
      body: JSON.stringify({
        amount: body.total,
        currency: "XOF",
        orderReference,
        description: `Commande Diakoboulon ${orderReference}`,
        country: "ML", // Mali — enlevez cette ligne pour laisser le client choisir son pays
        returnUrl: `${siteUrl}/paiement/succes?ref=${orderReference}${debugError ? `&debug=${encodeURIComponent(debugError)}` : ""}`,
        cancelUrl: `${siteUrl}/paiement/annule`,
        webhookUrl: `${siteUrl}/api/webhooks/senepay`,
        metadata: { orderReference },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur SenePay :", data);
      return NextResponse.json(
        { ok: false, error: data.message || "Le paiement n'a pas pu être initié." },
        { status: res.status }
      );
    }

    // Le client doit être redirigé vers data.checkoutUrl pour payer.
    return NextResponse.json({ ok: true, checkoutUrl: data.checkoutUrl, orderId: orderReference, debugError });
  } catch (err) {
    console.error("Erreur réseau SenePay :", err);
    return NextResponse.json({ ok: false, error: "Impossible de contacter SenePay." }, { status: 500 });
  }
}
