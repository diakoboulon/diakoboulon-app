import crypto from "crypto";
import { NextResponse } from "next/server";

// Reçoit les notifications de paiement de SenePay (succès ou échec) et vérifie
// leur authenticité via la signature HMAC-SHA256, comme recommandé dans leur
// documentation. C'est la source de vérité la plus fiable — plus fiable que la
// simple redirection du client, qui peut être interrompue.
export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-senepay-signature");
  const secret = process.env.SENEPAY_WEBHOOK_SECRET;

  if (secret) {
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    if (signature !== expected) {
      return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
    }
  }

  const payload = JSON.parse(rawBody);

  if (payload.event === "checkout.session.completed") {
    // TODO: marquer la commande `payload.orderReference` comme payée dans Supabase
    // (payload.netAmount contient le montant net reçu après commission SenePay).
    console.log("Paiement confirmé :", payload.orderReference, payload.netAmount);
  }

  if (payload.event === "checkout.session.failed") {
    // TODO: marquer la commande comme échouée, notifier le client si besoin.
    console.log("Paiement échoué :", payload.orderReference);
  }

  // Toujours répondre 200 rapidement, sinon SenePay réessaiera.
  return NextResponse.json({ received: true });
}
